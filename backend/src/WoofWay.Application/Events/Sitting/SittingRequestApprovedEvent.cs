using WoofWay.Domain.Common;

namespace WoofWay.Application.Events.Sitting;

public class SittingRequestApprovedEvent : IDomainEvent
{
    public string SittingRequestId { get; }
    public string SittingOfferId { get; }
    public string OwnerId { get; }
    public string OwnerName { get; }
    public string DogId { get; }
    public string DogName { get; }
    public string SitterId { get; }
    public string SitterName { get; }

    public SittingRequestApprovedEvent(
        string sittingRequestId,
        string sittingOfferId,
        string ownerId,
        string dogId,
        string sitterId,
        string ownerName,
        string dogName,
        string sitterName
        )
    {
        SittingRequestId = sittingRequestId;
        SittingOfferId = sittingOfferId;
        OwnerId = ownerId;
        DogId = dogId;
        SitterId = sitterId;
        OwnerName = ownerName;
        DogName = dogName;
        SitterName = sitterName;
    }
}