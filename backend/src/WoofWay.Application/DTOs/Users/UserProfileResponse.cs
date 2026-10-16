namespace WoofWay.Application.DTOs.Users;

public record UserProfileResponse(
    string Id,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string City,
    string Role,
    string? ImageUrl,
    object? RoleDetails
);