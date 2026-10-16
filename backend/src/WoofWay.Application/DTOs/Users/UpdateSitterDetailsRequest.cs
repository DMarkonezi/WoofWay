namespace WoofWay.Application.DTOs.Users;

public record UpdateSitterDetailsRequest(
    string Bio,
    decimal PricePerHour
);