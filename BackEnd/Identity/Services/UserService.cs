using Core.Abstractions;
using Core.Entities.Identity;
using Core.Models.Auth;
using Core.Models.Shared.ServiceResult;
using Core.Models.Users;
using Core.Services.Identity.User;
using Identity.Extensions;
using Identity.Mappers.Auth;
using Identity.Mongo.Constants;
using MongoDB.Driver;

namespace Identity.Services;

public class UserService : BaseService, IUserService
{
    private readonly ICurrentUserContext _currentUserContext;
    private readonly IMongoCollection<ApplicationUser> _userCollection;

    public UserService(IMongoClient mongoClient, ICurrentUserContext currentUserContext)
    {
        _currentUserContext = currentUserContext;
        _userCollection = mongoClient.GetIdentityDatabase()
            .GetCollection<ApplicationUser>(IdentityDatabaseCollectionNames.UsersCollection);
    }

    public async Task<UserDetailsModel> GetCurrentUserDataAsync()
    {
        var user = await _userCollection.Find(u => u.Id == _currentUserContext.UserId)
            .FirstOrDefaultAsync();

        return user is null ? new UserDetailsModel() : user.ToUserDetailsModel();
    }

    public async Task<IEnumerable<UserDetailsModel>> GetUsersAsync(params Guid[] userIds)
    {
        var builders = Builders<ApplicationUser>.Filter;
        var filter = userIds.Length == 1 ? builders.Eq(p => p.Id, userIds[0]) : builders.In(p => p.Id, userIds);
        return await _userCollection.Find(filter)
            .Project(p => new UserDetailsModel()
            {
                Id = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                ProfileImage = p.ProfileImage
            }).ToListAsync();
    }

    public async Task<PagedServiceResult<UserDetailsModel>> GetPagedListAsync(UsersPagedQueryModel usersPagedQueryModel)
    {
        var filter = Builders<ApplicationUser>.Filter.Ne(p => p.Id, _currentUserContext.UserId);
        if (!string.IsNullOrEmpty(usersPagedQueryModel.SearchTerm))
        {
            var regex = $".*{usersPagedQueryModel.SearchTerm}.*";
            filter &= Builders<ApplicationUser>.Filter.Regex(m => m.FirstName, regex);
        }

        var cursor = _userCollection.Find(filter);
        var totalCount = await cursor.CountDocumentsAsync();
        
        var data = await cursor
            .Project(p => new UserDetailsModel()
            {
                Id = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                ProfileImage = p.ProfileImage
            }).ToListAsync();
        return ReturnSuccess(data, (int)totalCount);
    }

    public async Task UserConnectedAsync(string userId)
    {
        await UserConnectionChangedAsync(userId, true);
    }

    public async Task UserDisconnectedAsync(string userId)
    {
        await UserConnectionChangedAsync(userId, false);
    }

    private async Task UserConnectionChangedAsync(string userId, bool connecting)
    {
        var filter = Builders<ApplicationUser>.Filter.Eq(m => m.Id, new Guid(userId));
        var update = Builders<ApplicationUser>.Update.Set(m => m.IsOnline, connecting)
            .Set(m => m.LastSeen, DateTime.UtcNow);

        await _userCollection.UpdateOneAsync(filter, update);
    }
}