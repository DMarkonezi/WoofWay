using WoofWay.Application.DTOs.Response;
using WoofWay.Application.DTOs.Users;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;

namespace WoofWay.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IShelterRepository _shelterRepository;

    public UserService(IUserRepository userRepository, IShelterRepository shelterRepository)
    {
        _userRepository = userRepository;
        _shelterRepository = shelterRepository;
    }

    public async Task<ApiResponse<UserProfileResponse>> GetProfileAsync(string userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<UserProfileResponse>.Fail("Korisnik nije pronađen.");

        object? roleDetails = null;

        if (user.Role == UserRole.Shelter)
        {
            var shelter = await _shelterRepository.GetByUserIdAsync(userId);
            if (shelter != null)
            {
                roleDetails = new { 
                    shelter.ShelterName, 
                    shelter.Address, 
                    shelter.Description, 
                    shelter.Capacity 
                };
            }
        }

        var response = new UserProfileResponse(
            user.Id, user.FirstName, user.LastName, user.Email, user.PhoneNumber, 
            user.City, user.Role.ToString(), user.ImageUrl, roleDetails
        );

        return ApiResponse<UserProfileResponse>.Ok(response);
    }

    public Task<ApiResponse<string>> UpdateAvatarAsync(string userId, string imageUrl)
    {
        throw new NotImplementedException();
    }

    public async Task<ApiResponse<string>> UpdateProfileAsync(string userId, UpdateProfileRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<string>.Fail("Korisnik nije pronađen.");

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.PhoneNumber = request.PhoneNumber;
        user.City = request.City;

        await _userRepository.UpdateAsync(userId, user);
        return ApiResponse<string>.Ok("Profil uspešno ažuriran.");
    }

    public async Task<ApiResponse<string>> UpdateShelterDetailsAsync(string userId, UpdateShelterDetailsRequest request)
    {
        var shelter = await _shelterRepository.GetByUserIdAsync(userId);
        if (shelter == null) return ApiResponse<string>.Fail("Podaci o azilu nisu pronađeni.");

        shelter.ShelterName = request.ShelterName;
        shelter.Address = request.Address;
        shelter.Description = request.Description;
        shelter.Capacity = request.Capacity;

        await _shelterRepository.UpdateAsync(shelter.Id, shelter);
        return ApiResponse<string>.Ok("Podaci o azilu uspešno ažurirani.");
    }
}