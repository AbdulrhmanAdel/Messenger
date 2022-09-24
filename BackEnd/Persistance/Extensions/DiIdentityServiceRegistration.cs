using Core.Services;
using Core.Services.Conversations;
using Microsoft.Extensions.DependencyInjection;
using Persistance.Services;

namespace Persistance.Extensions;

public static class DiIdentityServiceRegistration
{
    public static IServiceCollection AddPersistenceService(this IServiceCollection services)
    {
        services.AddScoped<IConversationService, ConversationService>();
        services.AddScoped<IMessageService, MessageService>();
        return services;
    }
}