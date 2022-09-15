namespace Api.Models.Responses;

public class PagedObjectApiResponse<T> : ObjectApiResponse<IEnumerable<T>>
{
    public int TotalCount { get; set; }
}