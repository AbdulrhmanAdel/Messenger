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

    public PagedServiceResult<T> ReturnSuccess<T>(IEnumerable<T> data, int totalCount)
    {
        return new PagedServiceResult<T>()
        {
            Data = data,
            TotalCount = totalCount
        };
    }

    public PagedServiceResult<T> ReturnSuccess<T>(IEnumerable<T> data, long totalCount)
    {
        return new PagedServiceResult<T>()
        {
            Data = data,
            TotalCount = (int) totalCount
        };
    }
    
    public ServiceResultWithData<T> ReturnFailure<T>(string error, object data = null)
    {
        return new ServiceResultWithData<T>()
        {
            Errors = new List<string>() { error }
        };
    }

    public PagedServiceResult<T> ReturnPagedFailure<T>(string error)
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