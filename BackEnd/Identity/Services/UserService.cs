using Core.Abstractions;
using Core.Entities.Identity;
using Core.Models.Auth;
using Core.Services.Identity.User;
using Identity.Extensions;
using Identity.Mappers.Auth;
using Identity.Mongo.Constants;
using MongoDB.Driver;

namespace Identity.Services;

public class UserService : IUserService
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
}