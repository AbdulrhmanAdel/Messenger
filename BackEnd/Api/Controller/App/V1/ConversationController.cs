using System.Security.Claims;
using Api.Vaildators.Conversation;
using Core.Dtos.Conversation;
using Core.Models.Shared.Requests;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controller.App.V1;

[Authorize]
public class ConversationController : BaseAppV1Controller
{
    private readonly IConversationService _conversationService;

    public ConversationController(IConversationService conversationService)
    {
        _conversationService = conversationService;
    }

    [HttpGet("GetPagedList")]
    public async Task<IActionResult> GetPagedListAsync([FromQuery] PagedQueryModel queryModel)
    {
        var result = await  _conversationService.GetPagedListAsync(queryModel);
        return PagedResult(result.Data, result.TotalCount);
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

        return result.Success ? ObjectResult(result.Data) : EmptyResult();
    }
}