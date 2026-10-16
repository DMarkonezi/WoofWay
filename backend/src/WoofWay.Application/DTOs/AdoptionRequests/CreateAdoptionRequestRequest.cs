namespace WoofWay.Application.DTOs.AdoptionRequests;

public class CreateAdoptionRequestRequest
{

    public string DogId { get; set; } = null!;
    public string? Note { get; set; }

    public CreateAdoptionRequestRequest() : this(default!, default!) {}

    public CreateAdoptionRequestRequest(string dogId, string note)
    {
        this.DogId = dogId;
        this.Note = note;
    }
}