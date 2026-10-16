namespace WoofWay.Application.DTOs.Dogs;

public record CreateDogRequest(
    string Name, 
    string Status,
    string Breed, 
    string Description, 
    string ImageUrl, 
    string Location
);