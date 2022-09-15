using Core.Services.Identity.Auth;
using Identity.Models.Token;
using Identity.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;

namespace Identity.Extensions;

public static class DiIdentityServiceRegistration
{
    public static IServiceCollection AddIdentityService(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<JwtSettings>(options => configuration.GetSection("JwtSettings").Get<JwtSettings>());
        services.AddSingleton<JwtTokenService>();
        services.AddSingleton<RefreshTokenService>();
        services.AddScoped<IAuthService, AuthService>();

        services.AddMongoDb(configuration);
        return services;
    }

    private static void AddMongoDb(this IServiceCollection services, IConfiguration configuration)
    {
        BsonDefaults.GuidRepresentation = GuidRepresentation.Standard;
        var conventionPack = new ConventionPack { new CamelCaseElementNameConvention() };
        ConventionRegistry.Register("camelCase", conventionPack, t => true);
        services.AddSingleton<IMongoClient>(c => new MongoClient(configuration["MongoDb:ConnectionString"]));
    }
}