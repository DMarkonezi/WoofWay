using WoofWay.Application.DTOs.Shelter;
using WoofWay.Application.DTOs.Dogs;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Domain.Entities;

namespace WoofWay.Application.Services;

public class ShelterService : IShelterService
{
    private readonly IRepository<Shelter> _shelterRepository;
    private readonly IRepository<Dog> _dogRepository;
    private readonly IRepository<AdoptionRequest> _adoptionRequestsRepository;
    private readonly ICurrentUserService _currentUserService;

    public ShelterService(
        IRepository<Shelter> shelterRepository, 
        IRepository<Dog> dogRepository, 
        ICurrentUserService currentUserService,
        IRepository<AdoptionRequest> adoptionRequestsRepository
    )
    {
        _shelterRepository = shelterRepository;
        _dogRepository = dogRepository;
        _currentUserService = currentUserService;
        _adoptionRequestsRepository = adoptionRequestsRepository;
    }

    public async Task<ApiResponse<IEnumerable<ShelterResponse>>> GetAllVerifiedAsync()
    {
        var shelters = _shelterRepository.GetQueryable()
            .Where(s => s.IsVerified)
            .ToList();
        
        var response = shelters.Select(s => new ShelterResponse(
            s.Id, 
            s.ShelterName, 
            s.Address, 
            s.Description, 
            s.IsVerified, 
            new List<DogResponse>()
        ));

        return ApiResponse<IEnumerable<ShelterResponse>>.Ok(response);
    }

    public async Task<ApiResponse<ShelterResponse>> GetByIdAsync(string id)
    {
        var shelter = await _shelterRepository.GetByIdAsync(id);

        if (shelter == null)
            return ApiResponse<ShelterResponse>.Fail("Azil nije pronađen.");

        var dogs = _dogRepository.GetQueryable()
            .Where(d => d.CreatorId == shelter.UserId)
            .ToList();

        var adopterId = _currentUserService.UserId;

        Dictionary<string, AdoptionRequest> requestMap = new();

        if (!string.IsNullOrEmpty(adopterId))
        {
            var requests = _adoptionRequestsRepository
                .GetQueryable()
                .Where(r => r.AdopterId == adopterId)
                .ToList();

            requestMap = requests
                .GroupBy(r => r.DogId)
                .ToDictionary(
                    g => g.Key,
                    g => g.OrderByDescending(x => x.CreatedAt).First()
                );
        }

        var dogResponses = dogs.Select(d =>
        {
            requestMap.TryGetValue(d.Id, out var request);

            return new DogResponse(
                d.Id,
                d.CreatorId,
                d.Name ?? "Nepoznato",
                d.Status.ToString(),
                d.UserReportedBreed ?? "Nepoznato",
                d.Description,
                d.ImageUrl,
                d.LastKnownLocation,
                d.EventDate,
                request?.Status,
                request?.Id
            );
        }).ToList();

        // 4. response
        var response = new ShelterResponse(
            shelter.Id,
            shelter.ShelterName,
            shelter.Address,
            shelter.Description,
            shelter.IsVerified,
            dogResponses
        );

        return ApiResponse<ShelterResponse>.Ok(response);
    }

}