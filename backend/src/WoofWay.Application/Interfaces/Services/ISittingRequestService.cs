using WoofWay.Application.DTOs.Response;
using WoofWay.Application.DTOs.SittingRequests;
using WoofWay.Domain.Enums;

namespace WoofWay.Application.Interfaces.Services;

public interface ISittingRequestService
{
    Task<ApiResponse<IEnumerable<SittingRequestResponse>>> GetMyRequestsAsync(string userId, UserRole role);
    Task<ApiResponse<string>> CreateAsync(CreateSittingRequestRequest request, string ownerId);
    Task<ApiResponse<string>> UpdateStatusAsync(string id, string status, string sitterId);
    Task<ApiResponse<string>> CancelRequestAsync(string id, string ownerId);
}