namespace Core.Dtos.Conversation.Messages;

public class PostMessageDto
{
    public Guid ConversationId { get; set; }
    public string? Message { get; set; }
}