using WoofWay.Application.DTOs.Auth;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.DTOs.Shelter;
using WoofWay.Application.DTOs.SittingOffers;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Domain.Entities;

namespace WoofWay.Application.Services;

public class AdminService : IAdminService
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Shelter> _shelterRepository;
    private readonly IRepository<SittingOffer> _offerRepository;

    public AdminService(
        IRepository<User> userRepository,
        IRepository<Shelter> shelterRepository,
        IRepository<SittingOffer> offerRepository)
    {
        _userRepository = userRepository;
        _shelterRepository = shelterRepository;
        _offerRepository = offerRepository;
    }

    public async Task<ApiResponse<IEnumerable<PendingShelterResponse>>> GetPendingSheltersAsync()
    {
        var shelters = (await _shelterRepository.GetAllAsync())
            .Where(s => !s.IsVerified);

        var response = new List<PendingShelterResponse>();
        foreach (var s in shelters)
        {
            var user = await _userRepository.GetByIdAsync(s.UserId);
            response.Add(new PendingShelterResponse(
                s.Id, s.UserId, s.ShelterName, s.RegistrationNumber,
                s.Address, s.Capacity, s.Description,
                user?.Email ?? "N/A",
                s.CreatedAt
            ));
        }

        return ApiResponse<IEnumerable<PendingShelterResponse>>.Ok(response);
    }

    public async Task<ApiResponse<string>> ApproveShelterAsync(string shelterId)
    {
        var shelter = await _shelterRepository.GetByIdAsync(shelterId);
        if (shelter == null) return ApiResponse<string>.Fail("Azil nije pronađen.");

        shelter.IsVerified = true; 
        await _shelterRepository.UpdateAsync(shelterId, shelter);
        
        return ApiResponse<string>.Ok("Azil uspešno verifikovan.");
    }

    public async Task<ApiResponse<string>> RejectShelterAsync(string shelterId)
    {
        var shelter = await _shelterRepository.GetByIdAsync(shelterId);
        if (shelter == null) return ApiResponse<string>.Fail("Azil nije pronađen.");

        await _shelterRepository.DeleteAsync(shelterId);
        return ApiResponse<string>.Ok("Azil odbijen i uklonjen.");
    }

    public async Task<ApiResponse<IEnumerable<UserResponse>>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        var response = users.Select(u => new UserResponse(
            u.Id, u.Email, u.FirstName, u.LastName, u.Role.ToString()
        ));

        return ApiResponse<IEnumerable<UserResponse>>.Ok(response);
    }

    public async Task<ApiResponse<string>> DeleteUserAsync(string userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<string>.Fail("Korisnik nije pronađen.");

        await _userRepository.DeleteAsync(userId);
        return ApiResponse<string>.Ok("Korisnik obrisan.");
    }

    public async Task<ApiResponse<IEnumerable<SittingOfferResponse>>> GetAllOffersAsync()
    {
        var offers = await _offerRepository.GetAllAsync();
        
        var response = offers.Select(o => new SittingOfferResponse(
            o.Id,
            o.SitterId,
            o.Title,
            o.Description,
            o.PricePerHour,
            o.MaxDogsCapacity,
            o.IsActive,
            "Uknown TODO",
            o.WeeklyAvailabilities.Select(a => new AvailabilityResponse(
                a.DayOfWeek, a.FromTime, a.ToTime, a.Note
            )).ToList()
        ));

        return ApiResponse<IEnumerable<SittingOfferResponse>>.Ok(response);
    }

    public async Task<ApiResponse<string>> DeleteOfferAsync(string offerId)
    {
        var offer = await _offerRepository.GetByIdAsync(offerId);
        if (offer == null) return ApiResponse<string>.Fail("Ponuda nije pronađena.");

        await _offerRepository.DeleteAsync(offerId);
        return ApiResponse<string>.Ok("Ponuda obrisana.");
    }
}