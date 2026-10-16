namespace WoofWay.Application.DTOs.SittingOffers;

public record AvailabilityRequest(
    string DayOfWeek,
    string FromTime,
    string ToTime,
    string? Note
);