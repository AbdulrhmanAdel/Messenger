namespace Api.Models.Responses;

public class EmptyApiResponse
{
    public static EmptyApiResponse Instance = new EmptyApiResponse();
    public bool IsSuccesses { get; set; }
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