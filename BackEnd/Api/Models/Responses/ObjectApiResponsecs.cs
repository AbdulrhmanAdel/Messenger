namespace Api.Models.Responses;

public class ObjectApiResponse<T> : EmptyApiResponse
{
    public T Data { get; set; }
}