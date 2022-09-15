using Api.Vaildators.Auth;
using Core.Dtos.Auth;
using Core.Services.Identity.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controller.App.V1;

public class AuthController : BaseAppV1Controller
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("Login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginDto loginDto)
    {
        var validateResult = new LoginValidator().Validate(loginDto);
        if (!validateResult.IsValid) return InvalidResult(validateResult.Errors.Select(m => m.ErrorMessage));

        var serviceResult = await _authService.LoginAsync(loginDto);
        return serviceResult.Success ? ObjectResult(serviceResult.Data) : InvalidResult(serviceResult.Errors);
    }

    [HttpPost("Register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterDto registerDto)
    {
        var validateResult = new RegistrationValidator().Validate(registerDto);
        if (!validateResult.IsValid) return InvalidResult(validateResult.Errors.Select(m => m.ErrorMessage));

        var serviceResult = await _authService.RegisterAsync(registerDto);
        return serviceResult.Success ? ObjectResult(serviceResult.Data) : InvalidResult(serviceResult.Errors);
    }
}