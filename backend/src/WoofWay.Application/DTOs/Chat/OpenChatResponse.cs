namespace WoofWay.Application.DTOs.Chat;

public record OpenChatRequest(
    string RequestId,
    string Type  // "Sitting" ili "Adoption"
);