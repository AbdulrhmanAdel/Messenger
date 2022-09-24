namespace Core.Entities.Conversation;

public class ConversationEntity : BaseEntity
{
    public IList<ConversationUserData> Participants { get; set; }
    public string Name { get; set; }
    public ConversationType ConversationType { get; set; }
    public string LastMessage { get; set; }
}