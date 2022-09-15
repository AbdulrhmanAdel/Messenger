using Identity.Extensions;
using Identity.Mongo.Constants;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Identity;

public class RefreshTokenEntity
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string AccessToken { get; set; }
    public Guid RefreshToken { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class RefreshTokenService
{
    private readonly IMongoCollection<RefreshTokenEntity> _refreshTokensCollection;

    public RefreshTokenService(IMongoClient mongoClient)
    {
        _refreshTokensCollection =
            mongoClient.GetIdentityDatabase()
                .GetCollection<RefreshTokenEntity>(IdentityDatabaseCollectionNames.RefreshTokensCollection);
    }

    private const int RefreshTokenLifetimeInDays = 30;

    public async Task<bool> ValidateRefreshTokenAsync(Guid refreshToken, string accessToken)
    {
        var filterBuilder = Builders<RefreshTokenEntity>
            .Filter;

        var filter = filterBuilder.Eq(r => r.RefreshToken, refreshToken) &
                     filterBuilder.Eq(r => r.AccessToken, accessToken);

        var cursor = await _refreshTokensCollection.FindAsync(filter);
        return await cursor.AnyAsync();
    }

    public async Task RefreshTokenAsync(string refreshToken, string token)
    {
        var refreshTokenEntity = new RefreshTokenEntity();

        if (refreshTokenEntity == null || refreshTokenEntity.AccessToken != token)
            return;

        if (refreshTokenEntity.AccessToken != token)
        {
        }
    }

    public async Task<string> GenerateRefreshTokenAsync(Guid userId, string token)
    {
        var isExists = await _refreshTokensCollection.Find(u => u.UserId == userId)
            .AnyAsync();

        var refreshToken = Guid.NewGuid();
        if (isExists)
        {
            await _refreshTokensCollection.UpdateOneAsync(r => r.UserId == userId,
                Builders<RefreshTokenEntity>.Update.Set(r => r.RefreshToken, refreshToken)
                    .Set(r => r.CreatedAt, DateTime.UtcNow)
                    .Set(r => r.AccessToken, token));
        }
        else
        {
            await _refreshTokensCollection.InsertOneAsync(new RefreshTokenEntity()
            {
                Id = Guid.NewGuid(),
                AccessToken = token,
                RefreshToken = refreshToken,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            });
        }

        return refreshToken.ToString();
    }
}