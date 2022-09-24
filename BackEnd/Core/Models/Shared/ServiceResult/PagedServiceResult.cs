namespace Core.Models.Shared.ServiceResult;

public class PagedServiceResult<T> : BaseServiceResult
{
    public IEnumerable<T> Data { get; set; }
    public int TotalCount { get; set; }
}