namespace WoofWay.Application.DTOs.Shelter;

public record PendingShelterResponse(
    string ShelterId,
    string UserId,
    string ShelterName,
    string RegistrationNumber,
    string Address,
    int Capacity,
    string Description,
    string ContactEmail,
    DateTime CreatedAt
);