namespace WoofWay.Application.DTOs.Dogs;

public record SpottedDogRequest(
    string ImageUrl,
    string Location,
    string? Description
);