using WoofWay.Application.Common.Interfaces;
using WoofWay.Application.DTOs.AdoptionRequests;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Events.Adoption;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;

namespace WoofWay.Application.Services;

public class AdoptionRequestService : IAdoptionRequestService
{
    private readonly IRepository<AdoptionRequest> _requestRepository;
    private readonly IRepository<Dog> _dogRepository;
    private readonly IRepository<User> _userRepository;

    private readonly IEventDispatcher _eventDispatcher;

    public AdoptionRequestService(
        IRepository<AdoptionRequest> requestRepository,
        IRepository<Dog> dogRepository,
        IRepository<User> userRepository,
        IEventDispatcher eventDispatcher
        )
    {
        _requestRepository = requestRepository;
        _dogRepository = dogRepository;
        _userRepository = userRepository;
        _eventDispatcher = eventDispatcher;
    }

    public async Task<ApiResponse<string>> CreateAsync(CreateAdoptionRequestRequest request, string adopterId)
    {
        var dog = await _dogRepository.GetByIdAsync(request.DogId);
        if (dog == null) 
            return ApiResponse<string>.Fail("Pas ne postoji.");

        var existingRequest = _requestRepository.GetQueryable()
            .FirstOrDefault(r => r.DogId == request.DogId && r.AdopterId == adopterId && r.Status == RequestStatus.Pending);
        
        if (existingRequest != null)
            return ApiResponse<string>.Fail("Već ste poslali zahtev za ovog psa.");

        var adoptionRequest = new AdoptionRequest
        {
            DogId = request.DogId,
            AdopterId = adopterId,
            ShelterId = dog.CreatorId ?? throw new Exception("Pas nema dodeljen azil."),
            Note = request.Note,
            Status = RequestStatus.Pending
        };

        await _requestRepository.CreateAsync(adoptionRequest);
        return ApiResponse<string>.Ok(adoptionRequest.Id);
    }

    public async Task<ApiResponse<string>> UpdateStatusAsync(string id, string status, string shelterId)
    {
        var request = await _requestRepository.GetByIdAsync(id);
        if (request == null) return ApiResponse<string>.Fail("Zahtev nije pronađen.");
        
        if (request.ShelterId != shelterId)
            return ApiResponse<string>.Fail("Nemate dozvolu za upravljanje ovim azilom.");

        if (!Enum.TryParse<RequestStatus>(status, out var newStatus))
            return ApiResponse<string>.Fail("Nevažeći status.");

        request.Status = newStatus;
        await _requestRepository.UpdateAsync(id, request);

        var dog = await _dogRepository.GetByIdAsync(request.DogId);
        var adopter = await _userRepository.GetByIdAsync(request.AdopterId);

        if (newStatus == RequestStatus.Approved)
        {
            try 
            {
                await _eventDispatcher.PublishAsync(
                    new AdoptionRequestApprovedEvent(
                        request.Id,
                        request.DogId,
                        request.AdopterId,
                        request.ShelterId,
                        adopter?.FirstName,
                        dog?.Name
                    )
                );

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Greška pri kreiranju chat sobe: {ex.Message}");
            }
        }

        return ApiResponse<string>.Ok("Status zahteva uspešno ažuriran.");
    }

    public async Task<ApiResponse<IEnumerable<AdoptionRequestResponse>>> GetMyRequestsAsync(string userId, UserRole role)
    {
        var query = _requestRepository.GetQueryable();

        if (role == UserRole.Shelter)
            query = query.Where(r => r.ShelterId == userId);
        else
            query = query.Where(r => r.AdopterId == userId);

        var requests = query.ToList();
        var result = new List<AdoptionRequestResponse>();

        foreach (var r in requests)
        {
            var dog = await _dogRepository.GetByIdAsync(r.DogId);
            var user = role == UserRole.Shelter 
                ? await _userRepository.GetByIdAsync(r.AdopterId)
                : await _userRepository.GetByIdAsync(r.ShelterId);

            result.Add(new AdoptionRequestResponse(
                r.Id, 
                r.DogId, 
                dog?.Name ?? "Nepoznato",
                r.AdopterId, 
                user?.FullName ?? "Nepoznato",
                r.Status.ToString(), 
                r.Note
            ));
        }

        return ApiResponse<IEnumerable<AdoptionRequestResponse>>.Ok(result);
    }
}