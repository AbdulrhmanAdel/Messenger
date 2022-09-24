using Api.Controller.App.V1.Hubs;
using Core.Abstractions;
using Core.Dtos.Conversation.Messages;
using Core.Models.Conversations;
using Core.Services.Conversations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Api.Controller.App.V1;

[Authorize]
public class MessageController : BaseAppV1Controller
{
    private readonly IHubContext<ChatHub> _hub;
    private readonly IMessageService _messageService;
    private readonly ICurrentUserContext _currentUserContext;

    public MessageController(IHubContext<ChatHub> hub, IMessageService messageService, ICurrentUserContext currentUserContext)
    {
        _hub = hub;
        _messageService = messageService;
        _currentUserContext = currentUserContext;
    }

    [HttpGet("GetPagedList")]
    public async Task<IActionResult> GetPagedListAsync([FromQuery] MessagePagedQueryModel query)
    {
        var message = await _messageService.GetPagedListAsync(query);
        return PagedResult(message.Data, message.TotalCount);
    }

    [HttpPost("Post")]
    public async Task<IActionResult> PostAsync([FromBody] PostMessageDto postMessageDto)
    {
        var message = await _messageService.PostMessageAsync(postMessageDto);
        if (!message.Success)
        {
            return InvalidResult(message.Errors);
        }

        await _hub.Clients.Users(message.Data.MessageTargets.Select(m => m.ToString()))
            .SendCoreAsync("newMessage", new object?[] { new
            {
                conversationId = postMessageDto.ConversationId,
                senderId = _currentUserContext.UserId,
                message = message.Data.Message
            }});

        return EmptyResult();
    }
}