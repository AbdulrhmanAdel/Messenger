namespace Core.Models.Shared.ServiceResult;

public class ServiceResultWithData<T> : BaseServiceResult
{
    public T Data { get; set; }
}