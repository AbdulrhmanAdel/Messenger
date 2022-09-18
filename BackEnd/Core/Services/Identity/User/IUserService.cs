using Core.Models.Auth;

namespace Core.Services.Identity.User;

public interface IUserService
{
    Task<UserDetailsModel> GetCurrentUserDataAsync();
}