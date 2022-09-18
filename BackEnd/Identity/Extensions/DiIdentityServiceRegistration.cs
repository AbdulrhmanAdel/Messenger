using System.Text;
using Core.Abstractions;
using Core.Services.Identity.Auth;
using Core.Services.Identity.User;
using Identity.Models.Token;
using Identity.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace Identity.Extensions;

public static class DiIdentityServiceRegistration
{
    public static IServiceCollection AddIdentityService(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>();
        services.AddSingleton(jwtSettings);
        services.AddScoped<ICurrentUserContext, CurrentUserContext>();
        services.AddSingleton<JwtTokenService>();
        services.AddSingleton<RefreshTokenService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();

        services.AddMongoDb(configuration);

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
                };
            });

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