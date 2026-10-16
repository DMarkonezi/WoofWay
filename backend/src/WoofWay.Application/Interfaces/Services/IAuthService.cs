using WoofWay.Application.DTOs.Auth;
using WoofWay.Application.DTOs.Response;

namespace WoofWay.Application.Interfaces.Services;

public interface IAuthService
{
    Task<ApiResponse<LoginResponse>> Login(LoginRequest request);
    Task<ApiResponse<string>> Register(RegisterRequest request);
    Task<ApiResponse<UserResponse>> GetCurrentUser(string userId);
}