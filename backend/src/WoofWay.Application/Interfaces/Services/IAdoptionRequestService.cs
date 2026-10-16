using WoofWay.Application.DTOs.AdoptionRequests;
using WoofWay.Application.DTOs.Response;
using WoofWay.Domain.Enums;

namespace WoofWay.Application.Interfaces.Services;

public interface IAdoptionRequestService
{
    Task<ApiResponse<string>> CreateAsync(CreateAdoptionRequestRequest request, string adopterId);
    Task<ApiResponse<string>> UpdateStatusAsync(string id, string status, string shelterId);
    Task<ApiResponse<IEnumerable<AdoptionRequestResponse>>> GetMyRequestsAsync(string userId, UserRole role);
}