namespace WoofWay.Application.Interfaces.Services;

public interface IBreedService
{
    bool IsValidBreed(string breedName);
    IEnumerable<string> GetOptions();
    IEnumerable<object> GetTranslatedOptions();
    Dictionary<string, string> GetAllTranslations();
    string GetTranslation(string breedIdentifier);
    Task CheckAndNotifyMatchesAsync(string spottedDogId, string detectedBreed, string location);
}