using Core.Models.Shared.Requests;
using Core.Models.Shared.ServiceResult;
using MongoDB.Driver;

namespace Persistance.Extensions;

public static class MongoExtensions
{
    public static IMongoDatabase GetPersistenceDatabase(this IMongoClient mongoClient)
    {
        return mongoClient.GetDatabase("messenger");
    }

    public static async Task<PagedServiceResult<T>> ToPagedResultAsync<T>(this IFindFluent<T, T> query,
        PagedQueryModel pagedQueryModel)
    {
        var totalRows = await query.CountDocumentsAsync();
        var data = await query.Skip((pagedQueryModel.CurrentPage - 1) * pagedQueryModel.PageSize)
            .Limit(pagedQueryModel.PageSize).ToListAsync();
        return new PagedServiceResult<T>()
        {
            Data = data,
            TotalCount = (int)totalRows
        };
    }
}