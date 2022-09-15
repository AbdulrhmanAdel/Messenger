using MongoDB.Driver;

namespace Identity.Extensions;

public static class MongoExtensions
{
    public static IMongoDatabase GetIdentityDatabase(this IMongoClient mongoClient)
    {
        return mongoClient.GetDatabase("messenger");
    }
}