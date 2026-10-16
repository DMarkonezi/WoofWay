using WoofWay.Application.DTOs.SittingRequests;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;
using WoofWay.Application.Common.Interfaces;
using WoofWay.Application.Events.Sitting;

namespace WoofWay.Application.Services;

public class SittingRequestService : ISittingRequestService
{
    private readonly IRepository<SittingRequest> _requestRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Dog> _dogRepository;
    private readonly IRepository<SittingOffer> _offerRepository;
    private readonly IEventDispatcher _eventDispatcher;

    public SittingRequestService(
        IRepository<SittingRequest> requestRepository, 
        IRepository<SittingOffer> offerRepository,
        IRepository<User> userRepository,
        IRepository<Dog> dogRepository,
        IEventDispatcher eventDispatcher
        )
    {
        _requestRepository = requestRepository;
        _offerRepository = offerRepository;
        _userRepository = userRepository;
        _dogRepository = dogRepository;
        _eventDispatcher = eventDispatcher;
    }

    private async Task UpdateExpiredRequestsToCompleted(string sitterId)
    {
        var myOfferIds = _offerRepository.GetQueryable()
            .Where(o => o.SitterId == sitterId)
            .Select(o => o.Id)
            .ToList();

        var expiredRequests = _requestRepository.GetQueryable()
            .Where(r => r.EndTime < DateTime.UtcNow 
                    && r.Status == RequestStatus.Approved 
                    && myOfferIds.Contains(r.SittingOfferId)) 
            .ToList();

        foreach (var request in expiredRequests)
        {
            request.Status = RequestStatus.Completed;
            await _requestRepository.UpdateAsync(request.Id, request);
        }
    }

    public async Task<ApiResponse<IEnumerable<SittingRequestResponse>>> GetMyRequestsAsync(string userId, UserRole role)
    {
        if (role == UserRole.Sitter)
        {
            await UpdateExpiredRequestsToCompleted(userId);
        }

        var query = _requestRepository.GetQueryable();

        if (role == UserRole.Owner)
        {
            query = query.Where(r => r.OwnerId == userId);
        }
        else if (role == UserRole.Sitter)
        {
            var myOfferIds = _offerRepository.GetQueryable()
                .Where(o => o.SitterId == userId)
                .Select(o => o.Id)
                .ToList();
                
            query = query.Where(r => myOfferIds.Contains(r.SittingOfferId));
        }

        query = query.Where(r => r.Status != RequestStatus.Completed);

        var requests = query.ToList();
        var result = new List<SittingRequestResponse>();

        foreach (var r in requests)
        {
            var owner = await _userRepository.GetByIdAsync(r.OwnerId);
            var dog = await _dogRepository.GetByIdAsync(r.DogId);
            var offer = await _offerRepository.GetByIdAsync(r.SittingOfferId);

            result.Add(new SittingRequestResponse(
                r.Id,
                r.SittingOfferId,
                offer?.Title ?? "Nepoznato",
                r.OwnerId,
                owner?.FullName ?? "Nepoznato",
                r.DogId,
                dog?.Name ?? "Nepoznato",
                r.StartTime,
                r.EndTime,
                r.Status.ToString(),
                r.TotalPrice,
                r.NoteFromOwner
            ));
        }

        return ApiResponse<IEnumerable<SittingRequestResponse>>.Ok(result);
    }
   
    public async Task<ApiResponse<string>> CreateAsync(CreateSittingRequestRequest request, string ownerId)
    {
        var offer = await _offerRepository.GetByIdAsync(request.SittingOfferId);
        if (offer == null || !offer.IsActive) 
            return ApiResponse<string>.Fail("Ponuda nije dostupna.");
            
        if (request.StartTime < DateTime.UtcNow)
            return ApiResponse<string>.Fail("Početak čuvanja ne može biti u prošlosti.");

        if (request.EndTime <= request.StartTime)
            return ApiResponse<string>.Fail("Vreme završetka mora biti nakon vremena početka.");

        string[] dayNames = { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };
        string requestedDay = dayNames[(int)request.StartTime.DayOfWeek];
        
        TimeSpan start = request.StartTime.TimeOfDay;
        TimeSpan end = request.EndTime.TimeOfDay;

        var isAvailable = offer.WeeklyAvailabilities.Any(a => 
            a.DayOfWeek == requestedDay && 
            start >= TimeSpan.Parse(a.FromTime) && 
            end <= TimeSpan.Parse(a.ToTime)
        );

        if (!isAvailable)
            return ApiResponse<string>.Fail("Čuvar nije dostupan u izabranom terminu ili van radnog vremena.");

        var hours = (request.EndTime - request.StartTime).TotalHours;
        var totalPrice = (decimal)hours * offer.PricePerHour;

        var sittingRequest = new SittingRequest
        {
            SittingOfferId = request.SittingOfferId,
            OwnerId = ownerId,
            DogId = request.DogId,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            NoteFromOwner = request.Note,
            TotalPrice = (decimal)totalPrice,
            Status = RequestStatus.Pending
        };

        var owner = await _userRepository.GetByIdAsync(ownerId);
        var dog = await _dogRepository.GetByIdAsync(request.DogId);
        var sitter = await _userRepository.GetByIdAsync(offer.SitterId);

        await _requestRepository.CreateAsync(sittingRequest);

        await _eventDispatcher.PublishAsync(
            new SittingRequestCreatedEvent(
                sittingRequest.Id,
                sittingRequest.SittingOfferId,
                sittingRequest.OwnerId,
                sittingRequest.DogId,
                offer.SitterId,
                sittingRequest.StartTime,
                sittingRequest.EndTime,
                owner?.FirstName ?? "Nepoznato",
                dog?.Name ?? "Nepoznato",
                sitter?.FirstName ?? "Nepoznato"
            )
        );

        return ApiResponse<string>.Ok(sittingRequest.Id);
    }

    public async Task<ApiResponse<string>> UpdateStatusAsync(string id, string status, string sitterId)
    {
        var request = await _requestRepository.GetByIdAsync(id);
        if (request == null) return ApiResponse<string>.Fail("Zahtev nije pronađen.");

        var offer = await _offerRepository.GetByIdAsync(request.SittingOfferId);
        if (offer?.SitterId != sitterId) 
            return ApiResponse<string>.Fail("Nemate dozvolu za upravljanje ovim zahtevom.");

        if (!Enum.TryParse<RequestStatus>(status, out var newStatus))
            return ApiResponse<string>.Fail("Nevažeći status.");

        var dog = await _dogRepository.GetByIdAsync(request.DogId);
        var sitter = await _userRepository.GetByIdAsync(offer.SitterId);

        request.Status = newStatus;
        await _requestRepository.UpdateAsync(id, request);

        if (newStatus == RequestStatus.Approved)
        {
            await _eventDispatcher.PublishAsync(
                new SittingRequestApprovedEvent(
                    request.Id,
                    request.SittingOfferId,
                    request.OwnerId,
                    request.DogId,
                    sitterId,
                    "Not needed for now",
                    dog?.Name ?? "Nepoznato",
                    sitter?.FirstName ?? "Nepoznato"
                )
            );
        }
        
        return ApiResponse<string>.Ok("Status zahteva uspešno ažuriran.");
    }

    public async Task<ApiResponse<string>> CancelRequestAsync(string id, string ownerId)
    {
        var request = await _requestRepository.GetByIdAsync(id);
        if (request == null) return ApiResponse<string>.Fail("Zahtev nije pronađen.");

        if (request.OwnerId != ownerId)
            return ApiResponse<string>.Fail("Možete otkazati samo sopstvene zahteve.");

        request.Status = RequestStatus.Cancelled;
        await _requestRepository.UpdateAsync(id, request);
        
        return ApiResponse<string>.Ok("Zahtev uspešno otkazan.");
    }
}