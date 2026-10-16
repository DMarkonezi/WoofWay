using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;
using WoofWay.Infrastructure.Persistence;
using WoofWay.Infrastructure.Repositories.Common;

namespace WoofWay.Infrastructure.Repositories;

public class DogRepository : Repository<Dog>, IDogRepository
{
    public DogRepository(MongoDbContext context) : base(context)
    {
    }

    public IQueryable<Dog> GetLostDogs() 
        => GetQueryable().Where(d => d.Status == DogStatus.Lost);

    public IQueryable<Dog> GetSpottedDogs() 
        => GetQueryable().Where(d => d.Status == DogStatus.Spotted);

    public IQueryable<Dog> GetDogsByLocation(string location) 
        => GetQueryable().Where(d => d.LastKnownLocation.Contains(location));

    public IQueryable<Dog> GetDogsByBreed(string breed, bool useAiDetection)
    {
        return useAiDetection 
            ? GetQueryable().Where(d => d.DetectedBreed == breed)
            : GetQueryable().Where(d => d.UserReportedBreed == breed);
    }
}