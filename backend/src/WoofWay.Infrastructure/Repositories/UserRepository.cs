using MongoDB.Driver;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Domain.Entities;
using WoofWay.Infrastructure.Persistence;
using WoofWay.Infrastructure.Repositories.Common;

namespace WoofWay.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(MongoDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _collection.Find(u => u.Email == email).FirstOrDefaultAsync();
    }
}