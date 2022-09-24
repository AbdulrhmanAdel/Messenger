using Core.Dtos.Conversation.Messages;
using Core.Entities.Conversation;
using Core.Models.Conversations;
using Core.Models.Shared.ServiceResult;

namespace Core.Services.Conversations;

public interface IMessageService
{
    Task<ServiceResultWithData<CreatedMessageModel>> PostMessageAsync(PostMessageDto postMessageDto);
    Task<PagedServiceResult<MessageEntity>> GetPagedListAsync(MessagePagedQueryModel query);
}