﻿using Core.Dtos.Auth;
using Core.Entities.Identity;
using Core.Models.Auth;
using Core.Models.Shared.ServiceResult;
using Core.Services.Identity.Auth;
using Identity.Extensions;
using Identity.Helpers;
using Identity.Mappers.Auth;
using Identity.Mongo.Constants;
using MongoDB.Driver;

namespace Identity.Services;

public class AuthService : BaseService, IAuthService
{
    private readonly JwtTokenService _jwtTokenService;
    private readonly RefreshTokenService _refreshTokenService;
    private readonly IMongoCollection<ApplicationUser> _userCollection;

    public AuthService(IMongoClient mongoClient, JwtTokenService jwtTokenService,
        RefreshTokenService refreshTokenService)
    {
        _jwtTokenService = jwtTokenService;
        _refreshTokenService = refreshTokenService;
        _userCollection = mongoClient.GetIdentityDatabase()
            .GetCollection<ApplicationUser>(IdentityDatabaseCollectionNames.UsersCollection);
    }

    public async Task<ServiceResultWithData<LoginResultModel>> LoginAsync(LoginDto loginDto)
    {
        var user = await _userCollection.Find(u => u.Email == loginDto.Credential)
            .FirstOrDefaultAsync();

        if (user == null || !PasswordHasher.VerifyPassword(loginDto.Password, user.Password))
            return ReturnFailure<LoginResultModel>("Invalid Credential");

        var tokenResultModel = _jwtTokenService.GenerateToken(user);
        tokenResultModel.RefreshToken =
            await _refreshTokenService.GenerateRefreshTokenAsync(user.Id, tokenResultModel.AccessToken);

        return ReturnSuccess(new LoginResultModel()
        {
            UserDetails = user.ToUserDetailsModel(),
            TokenDetails = tokenResultModel
        });
    }

    public async Task<ServiceResultWithData<LoginResultModel>> RegisterAsync(RegisterDto registerDto)
    {
        var isCredentialExists = await _userCollection.Find(u => u.Email == registerDto.Credential)
            .AnyAsync();

        if (isCredentialExists)
            return ReturnFailure<LoginResultModel>("Invalid Credential");

        var currentTime = DateTime.UtcNow;
        var user = new ApplicationUser()
        {
            Id = Guid.NewGuid(),
            Created = currentTime,
            Edited = currentTime,
            Email = registerDto.Credential,
            Password = PasswordHasher.HashPassword(registerDto.Password),
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            FullName = $"{registerDto.FirstName} {registerDto.LastName}"
        };

        await _userCollection.InsertOneAsync(user);

        var tokenResultModel = _jwtTokenService.GenerateToken(user);
        tokenResultModel.RefreshToken =
            await _refreshTokenService.GenerateRefreshTokenAsync(user.Id, tokenResultModel.AccessToken);

        return ReturnSuccess(new LoginResultModel()
        {
            UserDetails = user.ToUserDetailsModel(),
            TokenDetails = tokenResultModel
        });
    }
}