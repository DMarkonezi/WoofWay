namespace WoofWay.Application.DTOs.Auth;

public record UserResponse(string Id, string Email, string FirstName, string LastName, string Role);