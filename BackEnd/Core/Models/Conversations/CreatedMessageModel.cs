namespace Core.Models.Conversations;

public class CreatedMessageModel
{
    public IEnumerable<Guid> MessageTargets { get; set; }
    public string Message { get; set; }
    public string[] Media { get; set; }
}