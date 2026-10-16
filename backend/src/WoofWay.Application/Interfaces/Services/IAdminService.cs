using WoofWay.Application.DTOs.Auth;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.DTOs.Shelter;
using WoofWay.Application.DTOs.SittingOffers;

namespace WoofWay.Application.Interfaces.Services;

public interface IAdminService
{
    Task<ApiResponse<IEnumerable<PendingShelterResponse>>> GetPendingSheltersAsync();
    Task<ApiResponse<string>> ApproveShelterAsync(string shelterId);
    Task<ApiResponse<string>> RejectShelterAsync(string shelterId);
    Task<ApiResponse<IEnumerable<UserResponse>>> GetAllUsersAsync();
    Task<ApiResponse<string>> DeleteUserAsync(string userId);
    Task<ApiResponse<IEnumerable<SittingOfferResponse>>> GetAllOffersAsync();
    Task<ApiResponse<string>> DeleteOfferAsync(string offerId);
}