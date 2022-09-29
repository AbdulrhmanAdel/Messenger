using Core.Abstractions;
using Core.Dtos.Conversation.Messages;
using Core.Entities.Conversation;
using Core.Extensions;
using Core.Models.Conversations;
using Core.Models.Shared.ServiceResult;
using Core.Services;
using Core.Services.Conversations;
using MongoDB.Driver;
using Persistance.Extensions;

namespace Persistance.Services;

public class MessageService : BaseService, IMessageService
{
    private readonly ICurrentUserContext _currentUserContext;
    private readonly IConversationService _conversationService;
    private readonly IMongoCollection<MessageEntity> _messages;

    public MessageService(IMongoClient mongoClient,
        ICurrentUserContext currentUserContext, IConversationService conversationService)
    {
        _currentUserContext = currentUserContext;
        _conversationService = conversationService;
        _messages = mongoClient.GetPersistenceDatabase().GetCollection<MessageEntity>("messages");
    }

    public async Task<ServiceResultWithData<CreatedMessageModel>> PostMessageAsync(PostMessageDto postMessageDto)
    {
        if (!await _conversationService.HasAccessAsync(postMessageDto.ConversationId))
        {
            return ReturnFailure<CreatedMessageModel>("Invalid Params");
        }

        var message = EntityExtensions.CreateDefaultEntity<MessageEntity>();
        message.ConversationId = postMessageDto.ConversationId;
        message.Message = postMessageDto.Message;
        message.SenderId = _currentUserContext.UserId;

        await _messages.InsertOneAsync(message);
        await _conversationService.SetLastMessageAsync(message);
        
        var conParticipants =
            await _conversationService.GetConversationParticipantsAsync(postMessageDto.ConversationId);
        return new ServiceResultWithData<CreatedMessageModel>()
        {
            Data = new CreatedMessageModel()
            {
                Message = postMessageDto.Message,
                MessageTargets = conParticipants.Where(id => id != _currentUserContext.UserId)
            }
        };
    }

    public async Task<PagedServiceResult<MessageEntity>> GetPagedListAsync(MessagePagedQueryModel query)
    {
        if (!await _conversationService.HasAccessAsync(query.ConversationId))
        {
            return ReturnPagedFailure<MessageEntity>("Invalid Params");
        }

        var messages = await _messages
            .Find(m => m.ConversationId == query.ConversationId)
            .SortByDescending(p => p.Created)
            .ToPagedResultAsync(query);
        
        return messages;
    }
}