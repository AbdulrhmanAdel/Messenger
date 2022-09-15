namespace Core.Models.Shared.ServiceResult;

public class BaseService
{
    public BaseServiceResult ReturnSuccess()
    {
        return new BaseServiceResult();
    }

    public ServiceResultWithData<T> ReturnSuccess<T>(T model)
    {
        return new ServiceResultWithData<T>()
        {
            Data = model
        };
    }

    public PagedServiceResult<T> ReturnSuccess<T>(T data, int totalCount)
    {
        return new PagedServiceResult<T>()
        {
            Data = data,
            TotalCount = totalCount
        };
    }

    public ServiceResultWithData<T> ReturnFailure<T>(string error, object data = null)
    {
        return new PagedServiceResult<T>()
        {
            Errors = new List<string>() { error }
        };
    }
    
    public PagedServiceResult<T> ReturnFailure<T>(string error)
    {
        return new PagedServiceResult<T>()
        {
            Errors = new List<string>() { error }
        };
    }
    
    public BaseServiceResult ReturnFailure(string error)
    {
        return new BaseServiceResult()
        {
            Errors = new List<string>() { error }
        };
    }
}