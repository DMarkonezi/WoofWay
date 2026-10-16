using WoofWay.Domain.Enums;

namespace WoofWay.Application.DTOs.Auth;

public class RegisterRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string FirstName { get; set; } = null!; 
    public string LastName { get; set; } = null!;  
    public string PhoneNumber { get; set; } = null!; 
    public string City { get; set; } = null!;      
    public UserRole Role { get; set; }             

    // Opciona polja
    public string? ShelterName { get; set; }
    public string? Address { get; set; }
    public string? RegistrationNumber { get; set; }
    public int? Capacity { get; set; } // 'int' stavi kao 'int?'
    public string? Description { get; set; }
    public string? Bio { get; set; }
}