namespace Core.Entities.Identity;

public class ApplicationUser : BaseEntity
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string ProfileImage { get; set; }
    public bool IsVerified { get; set; }
}