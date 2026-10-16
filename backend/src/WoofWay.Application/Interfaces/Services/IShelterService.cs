using WoofWay.Application.DTOs.Response;
using WoofWay.Application.DTOs.Shelter;

namespace WoofWay.Application.Interfaces.Services;

public interface IShelterService
{
    Task<ApiResponse<IEnumerable<ShelterResponse>>> GetAllVerifiedAsync();
    Task<ApiResponse<ShelterResponse>> GetByIdAsync(string id);
}