namespace Core.Abstractions;

public interface ICurrentUserContext
{
    public Guid UserId { get; }
    public float TimeZoneOffset { get; }
}