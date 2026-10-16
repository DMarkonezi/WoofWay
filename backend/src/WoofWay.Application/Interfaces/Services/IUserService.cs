using WoofWay.Application.DTOs.Auth;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.DTOs.Users;

namespace WoofWay.Application.Interfaces.Services;

public interface IUserService
{
    Task<ApiResponse<UserProfileResponse>> GetProfileAsync(string userId);

    Task<ApiResponse<string>> UpdateProfileAsync(string userId, UpdateProfileRequest request);

    Task<ApiResponse<string>> UpdateShelterDetailsAsync(string userId, UpdateShelterDetailsRequest request);
    
    Task<ApiResponse<string>> UpdateAvatarAsync(string userId, string imageUrl);
}