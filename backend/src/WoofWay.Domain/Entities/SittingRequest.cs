using WoofWay.Domain.Common;
using WoofWay.Domain.Enums;

namespace WoofWay.Domain.Entities;

public class SittingRequest : BaseEntity
{
    public string SittingOfferId { get; set; } = null!;
    public string OwnerId { get; set; } = null!;
    public string DogId { get; set; } = null!;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string? NoteFromOwner { get; set; } 
    public RequestStatus Status { get; set; } = RequestStatus.Pending;
    public decimal TotalPrice { get; set; }
}