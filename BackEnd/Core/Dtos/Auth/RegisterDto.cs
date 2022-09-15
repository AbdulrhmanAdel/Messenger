namespace Core.Dtos.Auth;

public class RegisterDto
{
    public string Credential { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}