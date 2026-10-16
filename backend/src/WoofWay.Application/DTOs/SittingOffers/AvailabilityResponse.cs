namespace WoofWay.Application.DTOs.SittingOffers;

public record AvailabilityResponse(
    string DayOfWeek,
    string FromTime,
    string ToTime,
    string? Note
);