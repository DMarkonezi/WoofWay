namespace WoofWay.Application.DTOs.Chat;

public record ChatMessageResponse(
    string Id,
    string ChatRoomId,
    string SenderId,
    string Content,
    bool IsRead,
    DateTime Timestamp
);