namespace Core.Models.Auth;

public class UserDetailsModel
{
    public Guid Id { get; set; }
    public string FullName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public bool IsVerified { get; set; }
    public string ProfileImage { get; set; }
    
}