namespace WoofWay.Application.DTOs.AdoptionRequests;

public class AdoptionRequestResponse
{
    public string Id { get; set; }
    public string DogId { get; set; }
    public string DogName { get; set; }
    public string AdopterId { get; set; }
    public string AdopterFullName { get; set; }
    public string Status { get; set; }
    public string? Note { get; set; }

    public AdoptionRequestResponse(
        string id, 
        string dogId, 
        string dogName, 
        string adopterId, 
        string adopterFullName, 
        string status, 
        string? note)
    {
        Id = id;
        DogId = dogId;
        DogName = dogName;
        AdopterId = adopterId;
        AdopterFullName = adopterFullName;
        Status = status;
        Note = note;
    }
}