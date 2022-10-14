using System.Security.Claims;
using Core.Services.Identity.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.Controller.App.V1.Hubs;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ChatHub : Hub
{
    private readonly IUserService _userService;

    public ChatHub(IUserService userService)
    {
        _userService = userService;
    }

    public override async Task OnConnectedAsync()
    {
        await _userService.UserConnectedAsync(Context.UserIdentifier);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await _userService.UserDisconnectedAsync(Context.UserIdentifier);
        await base.OnConnectedAsync();
    }

    public void SendMessage(string to, string message)
    {
        Clients.User(to).SendAsync("newMessage", message);
    }
}