using System.Text.Json;
using WoofWay.Application.DTOs.Breeds;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Domain.Enums;

namespace WoofWay.Application.Services;

public class BreedService : IBreedService
{
    //private readonly INotificationPublisher _notificationPublisher;
    private readonly Dictionary<string, BreedItem> _breedsByEnglish;
    private readonly Dictionary<string, BreedItem> _breedsById;

    public BreedService()
    {
        _breedsByEnglish = new Dictionary<string, BreedItem>(StringComparer.OrdinalIgnoreCase);
        _breedsById = new Dictionary<string, BreedItem>(StringComparer.OrdinalIgnoreCase);

        LoadBreedsJson();
    }

    private void LoadBreedsJson()
    {
        try
        {
            var jsonPath = Path.Combine("C:/Users/LENOVO/Fax/III/software-engineering/projectS/si.26.61.woo/Aplikacija/backend/src/WoofWay.Domain/Data", "dogs.json");
            Console.WriteLine(jsonPath);
            
            if (!File.Exists(jsonPath)) return;

            var jsonString = File.ReadAllText(jsonPath);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var root = JsonSerializer.Deserialize<BreedJsonRoot>(jsonString, options);

            if (root?.Breeds != null)
            {
                foreach (var breed in root.Breeds)
                {
                    _breedsByEnglish[breed.English] = breed;
                    _breedsById[breed.Id] = breed;
                }
            }
        }
        catch (Exception ex)
        {
            
        }
    }

    public Dictionary<string, string> GetAllTranslations()
    {
        return _breedsByEnglish.ToDictionary(x => x.Key, x => x.Value.Translation);
    }

    public string GetTranslation(string breedIdentifier)
    {
        if (string.IsNullOrEmpty(breedIdentifier)) return "Nepoznata rasa";

        if (_breedsByEnglish.TryGetValue(breedIdentifier, out var breedByEng))
        {
            return breedByEng.Translation;
        }

        if (_breedsById.TryGetValue(breedIdentifier, out var breedById))
        {
            return breedById.Translation;
        }
        return breedIdentifier.Replace("_", " ");
    }

    public bool IsValidBreed(string breedName)
    {
        return _breedsByEnglish.ContainsKey(breedName) || _breedsById.ContainsKey(breedName);
    }

    public IEnumerable<string> GetOptions()
    {
        return _breedsByEnglish.Keys.OrderBy(b => b);
    }

    public Task CheckAndNotifyMatchesAsync(string spottedDogId, string detectedBreed, string location)
    {
        throw new NotImplementedException();
    }

    public IEnumerable<object> GetTranslatedOptions()
    {
        return _breedsByEnglish
            .Select(x => new 
            { 
                English = x.Key, 
                Translation = x.Value.Translation 
            })
            .OrderBy(x => x.Translation) // Sortira po srpskom nazivu
            .ToList();
    }

}