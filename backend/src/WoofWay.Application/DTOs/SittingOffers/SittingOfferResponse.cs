namespace WoofWay.Application.DTOs.SittingOffers;

public record SittingOfferResponse(
    string Id, 
    string SitterId, 
    string Title, 
    string Description, 
    decimal PricePerHour, 
    int MaxDogsCapacity, 
    bool IsActive, 
    string City,
    List<AvailabilityResponse> WeeklyAvailabilities
);