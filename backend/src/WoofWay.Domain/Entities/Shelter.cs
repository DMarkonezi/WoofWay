using WoofWay.Domain.Common;

namespace WoofWay.Domain.Entities;

public class Shelter : BaseEntity
{
    public string UserId { get; set; } = null!;
    public string ShelterName { get; set; } = null!;
    public string RegistrationNumber { get; set; } = null!; 
    public string Address { get; set; } = null!;
    public int Capacity { get; set; }
    public string Description { get; set; } = null!;
    public bool IsVerified { get; set; } = false; 
}