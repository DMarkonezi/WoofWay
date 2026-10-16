using WoofWay.Domain.Common;

namespace WoofWay.Application.Events.Adoption;

public class AdoptionRequestApprovedEvent : IDomainEvent
{
    public string RequestId { get; }
    public string DogId { get; }
    public string AdopterId { get; }
    public string ShelterId { get; }

    public string? AdopterName { get; set; } 
    public string? DogName { get; set; }

    public AdoptionRequestApprovedEvent(
        string requestId,
        string dogId,
        string adopterId,
        string shelterId,
        string? adopterName,
        string? dogName
        )
    {
        RequestId = requestId;
        DogId = dogId;
        AdopterId = adopterId;
        ShelterId = shelterId;
        AdopterName = adopterName;
        DogName = dogName; 
    }
}