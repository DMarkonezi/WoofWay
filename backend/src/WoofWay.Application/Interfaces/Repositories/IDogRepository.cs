using WoofWay.Domain.Entities;

namespace WoofWay.Application.Interfaces.Repositories;

public interface IDogRepository : IRepository<Dog>
{
    IQueryable<Dog> GetLostDogs();
    IQueryable<Dog> GetSpottedDogs();
    IQueryable<Dog> GetDogsByLocation(string location);
    IQueryable<Dog> GetDogsByBreed(string breed, bool useAiDetection);
}
