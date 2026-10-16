using MongoDB.Driver;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Domain.Entities;
using WoofWay.Infrastructure.Persistence;
using WoofWay.Infrastructure.Repositories.Common;

namespace WoofWay.Infrastructure.Repositories;

public class ShelterRepository : Repository<Shelter>, IShelterRepository
{
    public ShelterRepository(MongoDbContext context) : base(context)
    {
    }
    public IQueryable<Shelter> GetVerifiedShelters() 
        => GetQueryable().Where(s => s.IsVerified == true);
    public IQueryable<Shelter> GetUnverifiedShelters() 
        => GetQueryable().Where(s => s.IsVerified == false);

    public async Task<Shelter> GetByUserIdAsync(string userId)
    {
        return await _collection.Find(s => s.UserId == userId).FirstOrDefaultAsync();
    }
}