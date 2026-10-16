namespace WoofWay.Domain.Common;

public abstract class BaseEntity
{
    public string Id { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}