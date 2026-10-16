using WoofWay.Domain.Common;

namespace WoofWay.Domain.Entities;

public class ChatMessage : BaseEntity
{
    public string ChatRoomId { get; set; } = null!;
    public string SenderId { get; set; } = null!;
    public string Content { get; set; } = null!;
    public bool IsRead { get; set; } = false;
    public DateTime Timestamp { get; set; }
}