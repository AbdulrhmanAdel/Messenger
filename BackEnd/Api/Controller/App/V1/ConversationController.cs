using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controller.App.V1;

[Authorize]
public class ConversationController : BaseAppV1Controller
{
    [HttpGet("GetPagedList")]
    public IActionResult GetPagedListAsync()
    {
        return ObjectResult(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
    }
}