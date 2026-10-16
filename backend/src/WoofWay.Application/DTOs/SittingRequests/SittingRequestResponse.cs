namespace WoofWay.Application.DTOs.SittingRequests;

public record SittingRequestResponse(
    string Id,
    string SittingOfferId,
    string OfferTitle,      
    string OwnerId,
    string OwnerName,      
    string DogId,
    string DogName,       
    DateTime StartTime,
    DateTime EndTime,
    string Status,
    decimal TotalPrice,
    string? Note
);