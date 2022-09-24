using Core.Models.Auth;
using Core.Models.Shared.ServiceResult;

namespace Core.Services.Identity.User;

public interface IUserService
{
    Task<UserDetailsModel> GetCurrentUserDataAsync();
    Task<IEnumerable<UserDetailsModel>> GetUsersAsync(params Guid[] userIds);
    Task<PagedServiceResult<UserDetailsModel>> GetPagedListAsync();
}