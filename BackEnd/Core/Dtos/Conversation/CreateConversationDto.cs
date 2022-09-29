using Core.Entities.Conversation;

namespace Core.Dtos.Conversation;

public class CreateConversationDto
{
    public IList<Guid> RecipientIds { get; set; }
    public ConversationType ConversationType { get; set; }
    public string Message { get; set; }
}