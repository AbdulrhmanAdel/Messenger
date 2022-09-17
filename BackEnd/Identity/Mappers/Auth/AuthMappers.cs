using Core.Entities.Identity;
using Core.Models.Auth;

namespace Identity.Mappers.Auth;

public static class AuthMappers
{
    public static UserDetailsModel ToUserDetailsModel(this ApplicationUser applicationUser)
    {
        return new UserDetailsModel()
        {
            Id = applicationUser.Id,
            Email = applicationUser.Email,
            FirstName = applicationUser.FirstName,
            IsVerified = applicationUser.IsVerified,
            LastName = applicationUser.LastName
        };
    }
}