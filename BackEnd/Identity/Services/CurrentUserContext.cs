using System.Security.Claims;
using Core.Abstractions;
using Microsoft.AspNetCore.Http;

namespace Identity.Services;

public class CurrentUserContext : ICurrentUserContext
{
    public Guid UserId { get; private set; }
    public float TimeZoneOffset { get; private set; }

    public CurrentUserContext(IHttpContextAccessor httpContextAccessor)
    {
        InitializeFields(httpContextAccessor);
    }

    private void InitializeFields(IHttpContextAccessor httpContextAccessor)
    {
        if (httpContextAccessor.HttpContext is null) return;

        var claim = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);

        if (claim is not null)
        {
            UserId = Guid.Parse(claim.Value);
        }
        
        TimeZoneOffset = GetTimeOffsetFromHeaders(httpContextAccessor.HttpContext.Response.Headers);
    }

    private float GetTimeOffsetFromHeaders(IHeaderDictionary headers)
    {
        var timeOffsetHeader = headers.FirstOrDefault(h => h.Key == "time-zone-offset");
        
        return string.IsNullOrWhiteSpace(timeOffsetHeader.Value)
            ? 0
            : float.Parse(timeOffsetHeader.Value);
    }
}