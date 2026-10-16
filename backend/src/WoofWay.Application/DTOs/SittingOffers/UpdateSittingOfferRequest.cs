namespace WoofWay.Application.DTOs.SittingOffers;

public record UpdateSittingOfferRequest(
    string Title, 
    string Description, 
    decimal PricePerHour, 
    int MaxDogsCapacity, 
    bool IsActive,
    List<AvailabilityRequest> WeeklyAvailabilities
);