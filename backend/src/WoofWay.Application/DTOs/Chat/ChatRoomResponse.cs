namespace WoofWay.Application.DTOs.Chat;

public record ChatRoomResponse(
    string Id,
    string RequestId,
    List<string> Participants,
    string LastMessagePreview,
    DateTime LastMessageAt
);