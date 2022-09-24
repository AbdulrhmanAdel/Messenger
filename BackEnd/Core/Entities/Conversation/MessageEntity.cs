namespace Core.Entities.Conversation;

public class MessageEntity : BaseEntity
{
    public Guid ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public bool IsDeleted { get; set; }
    public string? Message { get; set; }
    public string[]? MediaUrls { get; set; }
}