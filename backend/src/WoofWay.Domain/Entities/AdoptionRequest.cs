using WoofWay.Domain.Common;
using WoofWay.Domain.Enums;

namespace WoofWay.Domain.Entities;

public class AdoptionRequest : BaseEntity
{
    public string DogId { get; set; } = null!;        
    public string AdopterId { get; set; } = null!;   
    public string ShelterId { get; set; } = null!;    
    public string? Note { get; set; }                 
    public RequestStatus Status { get; set; } = RequestStatus.Pending;
}