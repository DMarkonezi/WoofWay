using WoofWay.Domain.Common;
using WoofWay.Domain.Enums;

namespace WoofWay.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string City { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public UserRole Role { get; set; }
    public string FullName => $"{FirstName} {LastName}";
}