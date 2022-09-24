using Core.Models.Shared.Requests;

namespace Core.Models.Conversations;

public class MessagePagedQueryModel : PagedQueryModel
{
    public Guid ConversationId { get; set; }
}