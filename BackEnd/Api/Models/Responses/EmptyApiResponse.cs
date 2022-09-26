namespace Api.Models.Responses;

public class EmptyApiResponse
{
    public static readonly EmptyApiResponse Instance = new EmptyApiResponse();

    public int? CustomErrorCode { get; set; }
    public bool IsSuccesses { get; set; } = true;
    public IEnumerable<string> ErrorMessages { get; set; } = Array.Empty<string>();

    public EmptyApiResponse()
    {
    }

    public EmptyApiResponse(string errorMessage)
    {
        ErrorMessages = new[] { errorMessage };
    }

    public EmptyApiResponse(IEnumerable<string> errorMessages)
    {
        ErrorMessages = errorMessages;
    }
}