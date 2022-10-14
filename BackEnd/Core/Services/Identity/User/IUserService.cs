using Core.Models.Auth;
using Core.Models.Shared.ServiceResult;
using Core.Models.Users;

namespace Core.Services.Identity.User;

public interface IUserService
{
    Task<UserDetailsModel> GetCurrentUserDataAsync();
    Task<IEnumerable<UserDetailsModel>> GetUsersAsync(params Guid[] userIds);
    Task<PagedServiceResult<UserDetailsModel>> GetPagedListAsync(UsersPagedQueryModel usersPagedQueryModel);
    Task UserDisconnectedAsync(string userId);

    Task UserConnectedAsync(string userId);
}