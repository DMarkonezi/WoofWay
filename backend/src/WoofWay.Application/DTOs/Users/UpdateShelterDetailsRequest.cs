namespace WoofWay.Application.DTOs.Users;

public record UpdateShelterDetailsRequest(
    string ShelterName,
    string Address,
    string Description,
    int Capacity
);