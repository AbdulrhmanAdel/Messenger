using Microsoft.AspNetCore.Mvc;

namespace Api.Controller.App.V1;

public class TokenController : BaseAppV1Controller
{
    [HttpPost("RefreshToken")]
    public async Task<IActionResult> RefreshTokenAsync()
    {
        return EmptyResult();
    }
}