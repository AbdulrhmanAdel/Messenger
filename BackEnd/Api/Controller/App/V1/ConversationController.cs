using System.Security.Claims;
using Api.Controller.App.V1.Hubs;
using Api.Extensions.Conversations;
using Api.Vaildators.Conversation;
using Core.Abstractions;
using Core.Dtos.Conversation;
using Core.Dtos.Conversation.Messages;
using Core.Models.Shared.Requests;
using Core.Services;
using Core.Services.Conversations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Api.Controller.App.V1;

[Authorize]
public class ConversationController : BaseAppV1Controller
{
    private readonly IHubContext<ChatHub> _chatHub;
    private readonly IConversationService _conversationService;
    private readonly ICurrentUserContext _currentUserContext;
    private readonly IMessageService _messageService;

    public ConversationController(IHubContext<ChatHub> chatHub, IConversationService conversationService,
        ICurrentUserContext currentUserContext, IMessageService messageService)
    {
        _chatHub = chatHub;
        _conversationService = conversationService;
        _currentUserContext = currentUserContext;
        _messageService = messageService;
    }

    [HttpGet("GetPagedList")]
    public async Task<IActionResult> GetPagedListAsync([FromQuery] PagedQueryModel queryModel)
    {
        var result = await _conversationService.GetPagedListAsync(queryModel);
        return PagedResult(result.Data, result.TotalCount);
    }

    [HttpGet("GetById")]
    public async Task<IActionResult> GetByIdAsync([FromQuery] Guid id)
    {
        if (id == Guid.Empty)
        {
            return InvalidResult();
        }

        var result = await _conversationService.GetByIdAsync(id);
        return ObjectResult(result.Data);
    }

    [HttpGet("Post")]
    public async Task<IActionResult> CreateConversationAsync([FromBody] CreateConversationDto createConversationDto)
    {
        var validateResult = new CreateConversationValidator().Validate(createConversationDto);
        if (!validateResult.IsValid)
        {
            return InvalidResult(validateResult.Errors.Select(m => m.ErrorMessage));
        }

        var result = await _conversationService.CreateConversationAsync(createConversationDto);

        await _messageService.PostMessageAsync(new PostMessageDto()
        {
            ConversationId = result.Data.Id,
            Message = createConversationDto.Message
        });

        await _chatHub.SendMessageAsync(createConversationDto.RecipientIds.Select(id => id.ToString()), new
        {
            conversationId = result.Data.Id,
            senderId = _currentUserContext.UserId,
            message = createConversationDto.Message
        });

        return result.Success ? ObjectResult(result.Data) : EmptyResult();
    }
}