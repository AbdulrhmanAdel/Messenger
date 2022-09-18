using Api.Controller.App.V1;
using Core.Services.Identity.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controller.App;

[Authorize]
public class UserController : BaseAppV1Controller
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }
    
    [HttpGet("GetCurrentUserData")]
    public async Task<IActionResult> GetCurrentUserDataAsync()
    {
        var currentUser = await _userService.GetCurrentUserDataAsync();
        return ObjectResult(currentUser);
    }
}