using WoofWay.Domain.Common;

namespace WoofWay.Domain.Entities;

public class ChatRoom : BaseEntity
{
    public string RequestId { get; set; } = null!;
    public List<string> Participants { get; set; } = null!; // UserIds
    public string LastMessagePreview { get; set; } = null!; // Za sidebar (optimizacija)
    public DateTime LastMessageAt { get; set; }
}