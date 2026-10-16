namespace WoofWay.Application.DTOs.SittingRequests;

public record CreateSittingRequestRequest(
    string SittingOfferId, string DogId, DateTime StartTime, DateTime EndTime, string? Note
);