using Core.Services.Identity.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controller.App.V1;

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
    
    [HttpGet("GetPagedList")]
    public async Task<IActionResult> GetPagedListAsync()
    {
        var users = await _userService.GetPagedListAsync();
        return PagedResult(users.Data, users.TotalCount);
    }
}