using Core.Dtos.Conversation;
using Core.Entities.Conversation;
using Core.Models.Shared.Requests;
using Core.Models.Shared.ServiceResult;

namespace Core.Services;

public interface IConversationService
{
    Task<PagedServiceResult<ConversationEntity>> GetPagedListAsync(PagedQueryModel pagedQueryModel);

    Task<ServiceResultWithData<ConversationEntity>>
        CreateConversationAsync(CreateConversationDto createConversationDto);

    Task<bool> HasAccessAsync(Guid conversationId, Guid? userId = null);
    Task<IEnumerable<Guid>> GetConversationParticipantsAsync(Guid conversationId);
}