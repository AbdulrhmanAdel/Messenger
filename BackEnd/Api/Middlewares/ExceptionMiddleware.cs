using System.Net;
using Api.Models.Responses;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Api.Middlewares;

public class ExceptionMiddleware
{
    private readonly JsonSerializerSettings _serializerSettings = new JsonSerializerSettings()
    {
        ContractResolver = new DefaultContractResolver
        {
            NamingStrategy = new CamelCaseNamingStrategy()
        }
    };

    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception e)
        {
            // Log Error

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            await httpContext.Response.WriteAsync(JsonConvert.SerializeObject(new EmptyApiResponse()
            {
                IsSuccesses = false,
                ErrorMessages = new[] { e.Message }
            }, _serializerSettings));
        }
    }
}