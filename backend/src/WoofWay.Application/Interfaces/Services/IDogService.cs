using WoofWay.Application.DTOs.Dogs;
using WoofWay.Application.DTOs.Response;

namespace WoofWay.Application.Interfaces.Services;

public interface IDogService
{
    Task<ApiResponse<IEnumerable<DogResponse>>> GetAllAsync(string? status, string? city);
    
    Task<ApiResponse<IEnumerable<DogResponse>>> GetMyAsync(string creatorId);
    
    Task<ApiResponse<DogResponse>> GetByIdAsync(string id);

    Task<ApiResponse<string>> CreateAsync(CreateDogRequest request, string creatorId);

    Task<ApiResponse<string>> UpdateStatusAsync(string id, string newStatus);

    Task<ApiResponse<string>> DeleteAsync(string id);

    Task<ApiResponse<SpottedDogResponse>> ReportSpottedAsync(SpottedDogRequest request);
}