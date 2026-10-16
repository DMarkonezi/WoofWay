using WoofWay.Domain.Common;
using WoofWay.Domain.ValueObjects;

namespace WoofWay.Domain.Entities;

public class SittingOffer : BaseEntity
{
    public string SitterId { get; set; } = null!;
    public string Title { get; set; } = null!; 
    public string Description { get; set; } = null!;
    public decimal PricePerHour { get; set; }
    public int MaxDogsCapacity { get; set; }
    public List<Availability> WeeklyAvailabilities { get; set; } = new();
    public bool IsActive { get; set; } = true;
}