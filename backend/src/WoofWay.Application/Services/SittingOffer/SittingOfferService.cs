using WoofWay.Application.DTOs.SittingOffers;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Domain.Entities;
using WoofWay.Domain.ValueObjects;

namespace WoofWay.Application.Services;

public class SittingOfferService : ISittingOfferService
{
    private readonly IRepository<SittingOffer> _repository;
    private readonly IUserRepository _userRepository;

    public SittingOfferService(
        IRepository<SittingOffer> repository,
        IUserRepository userRepository)
    {
        _repository = repository;
        _userRepository = userRepository;
    }

    private static List<AvailabilityResponse> MapAvailabilities(List<Availability> availabilities) =>
        availabilities.Select(a => new AvailabilityResponse(
            a.DayOfWeek,
            a.FromTime,
            a.ToTime,
            a.Note
        )).ToList();

    public async Task<ApiResponse<IEnumerable<SittingOfferResponse>>> GetAllActiveAsync(string? city)
    {
        var offers = _repository.GetQueryable()
            .Where(o => o.IsActive)
            .ToList();

        var result = new List<SittingOfferResponse>();

        foreach (var o in offers)
        {
            var sitter = await _userRepository.GetByIdAsync(o.SitterId);
            var sitterCity = sitter?.City ?? "";

            if (!string.IsNullOrEmpty(city) &&
                !sitterCity.Contains(city, StringComparison.OrdinalIgnoreCase))
                continue;

            result.Add(new SittingOfferResponse(
                o.Id,
                o.SitterId,
                o.Title,
                o.Description,
                o.PricePerHour,
                o.MaxDogsCapacity,
                o.IsActive,
                sitterCity,
                MapAvailabilities(o.WeeklyAvailabilities)
            ));
        }

        return ApiResponse<IEnumerable<SittingOfferResponse>>.Ok(result);
    }

    public async Task<ApiResponse<SittingOfferResponse>> GetByIdAsync(string id)
    {
        var offer = await _repository.GetByIdAsync(id);
        if (offer == null)
            return ApiResponse<SittingOfferResponse>.Fail("Ponuda nije pronađena.");

        var sitter = await _userRepository.GetByIdAsync(offer.SitterId);
        var sitterCity = sitter?.City ?? "";

        return ApiResponse<SittingOfferResponse>.Ok(new SittingOfferResponse(
            offer.Id,
            offer.SitterId,
            offer.Title,
            offer.Description,
            offer.PricePerHour,
            offer.MaxDogsCapacity,
            offer.IsActive,
            sitterCity,
            MapAvailabilities(offer.WeeklyAvailabilities)
        ));
    }

    public async Task<ApiResponse<string>> CreateAsync(CreateSittingOfferRequest request, string sitterId)
    {
        var offer = new SittingOffer
        {
            SitterId = sitterId,
            Title = request.Title,
            Description = request.Description,
            PricePerHour = request.PricePerHour,
            MaxDogsCapacity = request.MaxDogsCapacity,
            IsActive = true,
            WeeklyAvailabilities = request.WeeklyAvailabilities.Select(a => new Availability
            {
                DayOfWeek = a.DayOfWeek,
                FromTime = a.FromTime,
                ToTime = a.ToTime,
                Note = a.Note
            }).ToList()
        };

        await _repository.CreateAsync(offer);
        return ApiResponse<string>.Ok(offer.Id);
    }

    public async Task<ApiResponse<string>> UpdateAsync(string id, UpdateSittingOfferRequest request, string sitterId)
    {
        var offer = await _repository.GetByIdAsync(id);
        if (offer == null)
            return ApiResponse<string>.Fail("Ponuda nije pronađena.");

        if (offer.SitterId != sitterId)
            return ApiResponse<string>.Fail("Nemate dozvolu za izmenu ove ponude.");

        offer.Title = request.Title;
        offer.Description = request.Description;
        offer.PricePerHour = request.PricePerHour;
        offer.MaxDogsCapacity = request.MaxDogsCapacity;
        offer.IsActive = request.IsActive;
        offer.WeeklyAvailabilities = request.WeeklyAvailabilities.Select(a => new Availability
        {
            DayOfWeek = a.DayOfWeek,
            FromTime = a.FromTime,
            ToTime = a.ToTime,
            Note = a.Note
        }).ToList();

        await _repository.UpdateAsync(id, offer);
        return ApiResponse<string>.Ok("Ponuda uspešno ažurirana.");
    }

    public async Task<ApiResponse<string>> DeleteAsync(string id, string sitterId)
    {
        var offer = await _repository.GetByIdAsync(id);
        if (offer == null)
            return ApiResponse<string>.Fail("Ponuda nije pronađena.");

        if (offer.SitterId != sitterId)
            return ApiResponse<string>.Fail("Nemate dozvolu za brisanje ove ponude.");

        await _repository.DeleteAsync(id);
        return ApiResponse<string>.Ok("Ponuda uspešno obrisana.");
    }

    public async Task<ApiResponse<IEnumerable<SittingOfferResponse>>> GetMySittingOffersAsync(string sitterId)
    {
        var offers = _repository.GetQueryable()
            .Where(o => o.SitterId == sitterId)
            .ToList();

        var sitter = await _userRepository.GetByIdAsync(sitterId);
        var city = sitter?.City ?? "";

        var result = offers.Select(o => new SittingOfferResponse(
            o.Id,
            o.SitterId,
            o.Title,
            o.Description,
            o.PricePerHour,
            o.MaxDogsCapacity,
            o.IsActive,
            city,
            MapAvailabilities(o.WeeklyAvailabilities)
        ));

        return ApiResponse<IEnumerable<SittingOfferResponse>>.Ok(result);
    }
}