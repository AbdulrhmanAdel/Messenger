using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Core.Entities.Identity;
using Core.Models.Auth;
using Identity.Models.Token;
using Microsoft.IdentityModel.Tokens;

namespace Identity;

public class JwtTokenService
{
    private readonly JwtSettings _jwtSettings;
    private readonly SigningCredentials _credentials;

    public JwtTokenService(JwtSettings jwtSettings)
    {
        _jwtSettings = jwtSettings;
        _credentials =
            new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey)),
                SecurityAlgorithms.HmacSha256);
    }

    public TokenResultModel GenerateToken(ApplicationUser applicationUser)
    {
        var claims = new List<Claim>()
        {
            new Claim(ClaimTypes.NameIdentifier, applicationUser.Id.ToString())
        };

        var expireAt = DateTime.UtcNow.AddMinutes(_jwtSettings.LifeTimeInMinutes);
        var jwtHandler = new JwtSecurityTokenHandler();
        var securityToken = new JwtSecurityToken(_jwtSettings.Issuer, claims: claims,
            expires: expireAt, signingCredentials: _credentials);

        return new TokenResultModel()
        {
            AccessToken = jwtHandler.WriteToken(securityToken),
            ExpireAt = expireAt
        };
    }
}