namespace Core.Models.Auth;

public struct TokenResultModel
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public DateTime ExpireAt { get; set; }
}