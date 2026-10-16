namespace WoofWay.Application.DTOs.Users;

public record UpdateProfileRequest(
    string FirstName,
    string LastName,
    string PhoneNumber,
    string City
);