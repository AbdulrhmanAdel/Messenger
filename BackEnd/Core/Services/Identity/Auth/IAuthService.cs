using Core.Dtos.Auth;
using Core.Models.Auth;
using Core.Models.Shared.ServiceResult;

namespace Core.Services.Identity.Auth;

public interface IAuthService
{
    Task<ServiceResultWithData<LoginResultModel>> LoginAsync(LoginDto loginDto);
    Task<ServiceResultWithData<LoginResultModel>> RegisterAsync(RegisterDto registerDto);
}