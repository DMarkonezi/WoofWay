using WoofWay.Application.DTOs.Dogs;

namespace WoofWay.Application.DTOs.Shelter;

public record ShelterResponse(
    string Id, 
    string ShelterName, 
    string Address, 
    string Description, 
    bool IsVerified,
    IEnumerable<DogResponse> Dogs
);