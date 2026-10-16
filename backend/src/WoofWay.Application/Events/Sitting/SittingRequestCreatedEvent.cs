using WoofWay.Domain.Common;

namespace WoofWay.Application.Events.Sitting;

public class SittingRequestCreatedEvent : IDomainEvent
{
    public string SittingRequestId { get; }
    public string SittingOfferId { get; }
    public string OwnerId { get; }
    public string OwnerName { get; }
    public string DogId { get; }
    public string DogName { get; }
    public string SitterId { get; }
    public string SitterName { get; }
    public DateTime StartTime { get; }
    public DateTime EndTime { get; }

    public SittingRequestCreatedEvent(
        string sittingRequestId,
        string sittingOfferId,
        string ownerId,
        string dogId,
        string sitterId,
        DateTime startTime,
        DateTime endTime,
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
        StartTime = startTime;
        EndTime = endTime;
        OwnerName = ownerName;
        DogName = dogName;
        SitterName = sitterName;
    }
}