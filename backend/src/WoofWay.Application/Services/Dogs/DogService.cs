using WoofWay.Application.DTOs.Dogs;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Application.Interfaces.Services.ComputerVision;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;

namespace WoofWay.Application.Services;

public class DogService : IDogService
{
    private readonly IDogRepository _dogRepository;
    private readonly IComputerVisionService _cvService;
    private readonly ICurrentUserService _currentUser;

    public DogService(IDogRepository dogRepository, IComputerVisionService cvService, ICurrentUserService currentUser)
    {
        _dogRepository = dogRepository;
        _cvService = cvService;
        _currentUser = currentUser;
    }

    public async Task<ApiResponse<IEnumerable<DogResponse>>> GetAllAsync(string? status, string? city)
    {
        var query = _dogRepository.GetQueryable();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<DogStatus>(status, out var dogStatus))
        {
            query = query.Where(d => d.Status == dogStatus);
        }

        if (!string.IsNullOrEmpty(city))
        {
            query = query.Where(d => d.LastKnownLocation.ToLower().Contains(city.ToLower()));
        }

        var dogs = query.ToList();
        
        var response = dogs.Select(d => new DogResponse(
            d.Id, 
            d.CreatorId,
            d.Name ?? "N/A",
            d.Status.ToString(), 
            d.UserReportedBreed ?? "Nepoznato", 
            d.Description, 
            d.ImageUrl, 
            d.LastKnownLocation, 
            d.EventDate
        ));

        return ApiResponse<IEnumerable<DogResponse>>.Ok(response);
    }

    public async Task<ApiResponse<IEnumerable<DogResponse>>> GetMyAsync(string creatorId)
    {
        var dogs = _dogRepository.GetQueryable()
            .Where(d => d.CreatorId == creatorId)
            .ToList();

        var response = dogs.Select(d => new DogResponse(
            d.Id,
            d.CreatorId,
            d.Name ?? "N/A",
            d.Status.ToString(),
            d.UserReportedBreed ?? "Nepoznato",
            d.Description,
            d.ImageUrl,
            d.LastKnownLocation,
            d.EventDate
        ));

        return ApiResponse<IEnumerable<DogResponse>>.Ok(response);
    }

    public async Task<ApiResponse<DogResponse>> GetByIdAsync(string id)
    {
        var dog = await _dogRepository.GetByIdAsync(id);
        if (dog == null) return ApiResponse<DogResponse>.Fail("Pas nije pronađen.");

        return ApiResponse<DogResponse>.Ok(new DogResponse(
            dog.Id, dog.Name ?? "N/A", dog.CreatorId, dog.Status.ToString(), dog.UserReportedBreed ?? "Nepoznato", 
            dog.Description, dog.ImageUrl, dog.LastKnownLocation, dog.EventDate
        ));
    }

    public async Task<ApiResponse<string>> CreateAsync(CreateDogRequest request, string creatorId)
    {
        var dog = new Dog
        {
            CreatorId = creatorId,
            Name = request.Name,
            Status = Enum.Parse<DogStatus>(request.Status),
            UserReportedBreed = request.Breed,
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            LastKnownLocation = request.Location,
            EventDate = DateTime.UtcNow
        };

        await _dogRepository.CreateAsync(dog);
        return ApiResponse<string>.Ok(dog.Id);
    }

    public async Task<ApiResponse<string>> UpdateStatusAsync(string id, string newStatus)
    {
        var dog = await _dogRepository.GetByIdAsync(id);
        if (dog == null) return ApiResponse<string>.Fail("Pas nije pronađen.");

        if (!Enum.TryParse<DogStatus>(newStatus, out var status))
            return ApiResponse<string>.Fail("Nevažeći status.");

        dog.Status = status;
        await _dogRepository.UpdateAsync(id, dog);
        
        return ApiResponse<string>.Ok("Status uspešno ažuriran.");
    }

    public async Task<ApiResponse<string>> DeleteAsync(string id)
    {
        var dog = await _dogRepository.GetByIdAsync(id);
        if (dog == null) return ApiResponse<string>.Fail("Pas nije pronađen.");

        await _dogRepository.DeleteAsync(id);
        return ApiResponse<string>.Ok("Oglas uspešno obrisan.");
    }

    public async Task<ApiResponse<IEnumerable<DogResponse>>> GetSpottedDogsAsync()
    {
        var query = _dogRepository.GetQueryable().Where(d => d.Status == DogStatus.Spotted);

        var spottedDogs = query.ToList(); 

        var response = spottedDogs.Select(MapToResponse);
        
        return ApiResponse<IEnumerable<DogResponse>>.Ok(response);
    }

    private DogResponse MapToResponse(Dog d)
    {
        return new DogResponse(
            d.Id,
            d.CreatorId, 
            d.Name ?? "N/A", 
            d.Status.ToString(),
            d.UserReportedBreed ?? "Nepoznato",
            d.Description,
            d.ImageUrl,
            d.LastKnownLocation,
            d.EventDate
        );
    }

    public async Task<ApiResponse<SpottedDogResponse>> ReportSpottedAsync(SpottedDogRequest request)
    {
        var cvResult = await _cvService.PredictAsync(request.ImageUrl);

        var detectedBreeds = cvResult?.Predictions
            .Select(p => p.Breed)
            .ToArray() ?? Array.Empty<string>();

        var dog = new Dog
        {
            CreatorId = _currentUser.IsAuthenticated ? _currentUser.UserId : null,
            
            Status = DogStatus.Spotted,
            DetectedBreed = detectedBreeds.FirstOrDefault(),
            Description = request.Description ?? "Uočen pas na ulici",
            ImageUrl = request.ImageUrl,
            LastKnownLocation = request.Location,
            EventDate = DateTime.UtcNow,
        };

        await _dogRepository.CreateAsync(dog);

        return ApiResponse<SpottedDogResponse>.Ok(new SpottedDogResponse(
            dog.Id,
            dog.ImageUrl,
            detectedBreeds
        ));
    }
}