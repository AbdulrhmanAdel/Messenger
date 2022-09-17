namespace Core.Models.Auth;

public class LoginResultModel
{
    public UserDetailsModel UserDetails { get; set; }
    public TokenResultModel TokenDetails { get; set; }
}