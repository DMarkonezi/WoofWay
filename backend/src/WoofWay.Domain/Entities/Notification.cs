using WoofWay.Domain.Common;

namespace WoofWay.Domain.Entities;

public class Notification : BaseEntity
{
    public string UserId { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public bool IsRead { get; set; } = false;
    public string? LinkUrl { get; set; }
}