namespace WoofWay.Application.DTOs.Dogs;

public record SpottedDogResponse(
    string Id,
    string ImageUrl,
    string[] DetectedBreeds
);