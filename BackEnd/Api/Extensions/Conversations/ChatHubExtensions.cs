using Api.Controller.App.V1.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Api.Extensions.Conversations;

public static class ChatHubExtensions
{
    public static async Task SendMessageAsync(this IHubContext<ChatHub> hub, IEnumerable<string> userIds,
        object message)
    {
        await hub.Clients.Users(userIds)
            .SendCoreAsync("newMessage", new object?[]
            {
                message
            });
    }
}