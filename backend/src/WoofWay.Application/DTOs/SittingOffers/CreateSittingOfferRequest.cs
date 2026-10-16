namespace WoofWay.Application.DTOs.SittingOffers;

public record CreateSittingOfferRequest(
    string Title, 
    string Description, 
    decimal PricePerHour, 
    int MaxDogsCapacity,
    List<AvailabilityRequest> WeeklyAvailabilities
);