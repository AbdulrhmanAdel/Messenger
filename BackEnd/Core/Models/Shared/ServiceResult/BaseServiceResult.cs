namespace Core.Models.Shared.ServiceResult;

public class BaseServiceResult
{
    public IList<string> Errors { get; set; } = new List<string>();
    public bool Success => Errors.Count == 0;
}