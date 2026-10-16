using WoofWay.Domain.Common;
using WoofWay.Domain.Enums;

namespace WoofWay.Domain.Entities;

public class Dog : BaseEntity
{
    public string CreatorId { get; set; } = null!;
    public DogStatus Status { get; set; }
    public string? UserReportedBreed { get; set; } 
    public string? DetectedBreed { get; set; }  
    public string? Name { get; set; } 
    public int? Age { get; set; }
    public string Description { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public string LastKnownLocation { get; set; } = null!;
    public DateTime? EventDate { get; set; }
    public string? ContactPhone { get; set; }
}