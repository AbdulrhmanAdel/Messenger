using Core.Entities;

namespace Core.Extensions;

public class EntityExtensions
{
    public static T CreateDefaultEntity<T>() where T : BaseEntity, new()
    {
        var currentDate = DateTime.UtcNow;
        return new T()
        {
            Id = Guid.NewGuid(),
            Created = currentDate,
            Edited = currentDate
        };
    }
}