using Api.Models.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controller;

[ApiController]
public class BaseApiController : ControllerBase
{
    #region BadRequests

    protected IActionResult InvalidResult(int? customErrorCode = null)
    {
        return BadRequest(new EmptyApiResponse()
        {
            IsSuccesses = false,
            CustomErrorCode = customErrorCode
        });
    }

    protected IActionResult InvalidResult(string error, int? customErrorCode = null)
    {
        return BadRequest(new EmptyApiResponse(error)
        {
            IsSuccesses = false,
            CustomErrorCode = customErrorCode
        });
    }

    protected IActionResult InvalidResult(IEnumerable<string> errors, int? customErrorCode = null)
    {
        return BadRequest(new EmptyApiResponse(errors)
        {
            IsSuccesses = false,
            CustomErrorCode = customErrorCode
        });
    }

    #endregion

    protected IActionResult EmptyResult()
    {
        return Ok(EmptyApiResponse.Instance);
    }

    protected IActionResult ObjectResult<T>(T data)
    {
        return Ok(new ObjectApiResponse<T>()
        {
            Data = data
        });
    }

    protected IActionResult ListResult<T>(IEnumerable<T> data)
    {
        return Ok(new ObjectApiResponse<IEnumerable<T>>()
        {
            Data = data
        });
    }

    protected IActionResult PagedResult<T>(IEnumerable<T> data, int totalCount)
    {
        return Ok(new PagedObjectApiResponse<T>()
        {
            Data = data,
            TotalCount = totalCount
        });
    }
}