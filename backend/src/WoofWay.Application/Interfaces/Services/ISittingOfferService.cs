using WoofWay.Application.DTOs.Response;
using WoofWay.Application.DTOs.SittingOffers;

namespace WoofWay.Application.Interfaces.Services;

public interface ISittingOfferService
{
    Task<ApiResponse<IEnumerable<SittingOfferResponse>>> GetAllActiveAsync(string? city);
    Task<ApiResponse<SittingOfferResponse>> GetByIdAsync(string id);
    Task<ApiResponse<string>> CreateAsync(CreateSittingOfferRequest request, string sitterId);
    Task<ApiResponse<string>> UpdateAsync(string id, UpdateSittingOfferRequest request, string sitterId);
    Task<ApiResponse<string>> DeleteAsync(string id, string sitterId);
    Task<ApiResponse<IEnumerable<SittingOfferResponse>>> GetMySittingOffersAsync(string sitterId);
}