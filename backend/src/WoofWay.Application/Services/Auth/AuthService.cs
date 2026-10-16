using WoofWay.Application.DTOs.Auth;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;

namespace WoofWay.Application.Services.Auth;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IShelterRepository _shelterRepository;
    private readonly IJwtService _jwtService;

    public AuthService(IUserRepository userRepository, IShelterRepository shelterRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _shelterRepository = shelterRepository;
        _jwtService = jwtService;
    }

    public async Task<ApiResponse<LoginResponse>> Login(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return ApiResponse<LoginResponse>.Fail("Invalid email or password.");
        }

        if (user.Role == UserRole.Shelter)
        {
            var shelter = await _shelterRepository.GetByUserIdAsync(user.Id);
            if (shelter == null || !shelter.IsVerified)
            {
                return ApiResponse<LoginResponse>.Fail("Your account is pending moderator approval.");
            }
        }

        var token = _jwtService.GenerateToken(user);
        return ApiResponse<LoginResponse>.Ok(new LoginResponse(token, user.FullName));
    }

    public async Task<ApiResponse<string>> Register(RegisterRequest request)
    {
        if (await _userRepository.GetByEmailAsync(request.Email) != null)
        {
            return ApiResponse<string>.Fail("Email is already in use.");
        }

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            City = request.City,
            Role = request.Role
        };

        await _userRepository.CreateAsync(user);

        if (request.Role == UserRole.Shelter)
        {
            var shelter = new Shelter
            {
                UserId = user.Id,
                ShelterName = request.ShelterName!,
                Address = request.Address!,
                RegistrationNumber = request.RegistrationNumber!,
                Capacity = request.Capacity ?? 0,
                Description = request.Description ?? string.Empty,
                IsVerified = false 
            };
            await _shelterRepository.CreateAsync(shelter);
            return ApiResponse<string>.Ok("Shelter registration successful. Please wait for verification.");
        }

        return ApiResponse<string>.Ok("Registration successful.");
    }

    public async Task<ApiResponse<UserResponse>> GetCurrentUser(string userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) 
            return ApiResponse<UserResponse>.Fail("Korisnik nije pronađen.");

        var response = new UserResponse(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Role.ToString()
        );

        return ApiResponse<UserResponse>.Ok(response);
    }
}