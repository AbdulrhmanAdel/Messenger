using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.Controller.App.V1.Hubs;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ChatHub : Hub
{
    public void SendMessage(string to, string message)
    {
        Clients.User(to).SendAsync("newMessage", message);
        Clients.Users(to).SendAsync("newMessage", message);
    }
}