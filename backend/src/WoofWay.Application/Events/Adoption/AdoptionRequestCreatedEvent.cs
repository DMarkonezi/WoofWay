using WoofWay.Domain.Common;

namespace WoofWay.Application.Events.Adoption;

public class AdoptionRequestCreatedEvent : IDomainEvent
{
    public string RequestId { get; }
    public string DogId { get; }
    public string AdopterId { get; }
    public string ShelterId { get; }

    public AdoptionRequestCreatedEvent(
        string requestId,
        string dogId,
        string adopterId,
        string shelterId)
    {
        RequestId = requestId;
        DogId = dogId;
        AdopterId = adopterId;
        ShelterId = shelterId;
    }
}