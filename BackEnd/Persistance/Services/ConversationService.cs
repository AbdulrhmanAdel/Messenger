using Core.Abstractions;
using Core.Dtos.Conversation;
using Core.Entities.Conversation;
using Core.Models.Shared.Requests;
using Core.Models.Shared.ServiceResult;
using Core.Services;
using Core.Services.Identity.User;
using MongoDB.Bson;
using MongoDB.Driver;
using Persistance.Extensions;

namespace Persistance.Services;

public class ConversationService : BaseService, IConversationService
{
    private readonly IUserService _userService;
    private readonly ICurrentUserContext _currentUserContext;
    private readonly IMongoCollection<ConversationEntity> _conversations;

    public ConversationService(IUserService userService, IMongoClient mongoClient,
        ICurrentUserContext currentUserContext)
    {
        _userService = userService;
        _currentUserContext = currentUserContext;
        _conversations = mongoClient.GetPersistenceDatabase().GetCollection<ConversationEntity>("conversations");
    }

    public async Task<PagedServiceResult<ConversationEntity>> GetPagedListAsync(PagedQueryModel pagedQueryModel)
    {
        var filter = Builders<ConversationEntity>.Filter.Eq("participants._id", _currentUserContext.UserId);
        return await _conversations.Find(filter).ToPagedResultAsync(pagedQueryModel);
    }

    public async Task<ServiceResultWithData<ConversationEntity>> CreateConversationAsync(
        CreateConversationDto createConversationDto)
    {
        var participants = new List<Guid>(createConversationDto.RecipientIds)
        {
            _currentUserContext.UserId,
        };


        if (createConversationDto.ConversationType == ConversationType.Private)
        {
            var filter = Builders<ConversationEntity>.Filter.Size(p => p.Participants, 2) &
                         Builders<ConversationEntity>.Filter.All("participants._id", participants) &
                         Builders<ConversationEntity>.Filter.Eq(p => p.ConversationType, ConversationType.Private);

            if (await _conversations.Find(filter).AnyAsync())
            {
                return ReturnFailure<ConversationEntity>("Already Exists");
            }
        }

        var users = await _userService.GetUsersAsync(participants.ToArray());
        var conversation = new ConversationEntity()
        {
            Id = Guid.NewGuid(),
            Created = DateTime.UtcNow,
            Edited = DateTime.UtcNow,
            ConversationType = createConversationDto.ConversationType,
            Participants = users.Select(m => new ConversationUserData
            {
                Id = m.Id,
                FirstName = m.FirstName,
                LastName = m.LastName,
                ProfilePicture = m.ProfileImage
            }).ToList()
        };

        await _conversations.InsertOneAsync(conversation);
        return ReturnSuccess(conversation);
    }

    public async Task<bool> HasAccessAsync(Guid conversationId, Guid? userId = null)
    {
        userId ??= _currentUserContext.UserId;
        var filter = Builders<ConversationEntity>.Filter.Eq(c => c.Id, conversationId) &
                     Builders<ConversationEntity>.Filter.Eq("participants._id", userId);
        return await _conversations.Find(filter).AnyAsync();
    }

    public async Task<IEnumerable<Guid>> GetConversationParticipantsAsync(Guid conversationId)
    {
        return await _conversations.Find(Builders<ConversationEntity>.Filter.Eq(c => c.Id, conversationId))
            .Project(c => c.Participants.Select(p => p.Id))
            .FirstOrDefaultAsync();
    }


    private async Task<bool> IsConversationAlreadyExistsAsync(IList<Guid> participants,
        ConversationType conversationType)
    {
        //     if (conversationType == ConversationType.Private)
        //     {
        //         
        //     }
        //     var filter = Builders<ConversationEntity>.Filter.Size(p => p.Participants, participants.Count + 1);
        //     participants.Select(id => Builders<ConversationEntity>.Filter.in)
        //     Builders<ConversationEntity>.Filter.ElemMatch(m => m.Participants, p => par)
        //     return _conversations.Find()

        return true;
    }
}