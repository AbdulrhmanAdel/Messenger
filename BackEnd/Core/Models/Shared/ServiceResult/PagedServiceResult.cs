namespace Core.Models.Shared.ServiceResult;

public class PagedServiceResult<T> : ServiceResultWithData<T>
{
    public int TotalCount { get; set; }
}