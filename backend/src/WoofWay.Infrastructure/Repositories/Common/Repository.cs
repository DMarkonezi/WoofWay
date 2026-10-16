using MongoDB.Driver;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Domain.Common;
using WoofWay.Infrastructure.Persistence;

namespace WoofWay.Infrastructure.Repositories.Common;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly IMongoCollection<T> _collection;

    public Repository(MongoDbContext context)
    {
        _collection = context.Users.Database.GetCollection<T>(typeof(T).Name + "s");
    }

    public async Task<T?> GetByIdAsync(string id)
    {
        return await _collection.Find(e => e.Id == id).FirstOrDefaultAsync();
    }

    public async Task<IReadOnlyList<T>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public IQueryable<T> GetQueryable()
    {
        return _collection.AsQueryable();
    }

    public async Task CreateAsync(T entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        await _collection.InsertOneAsync(entity);
    }

    public async Task UpdateAsync(string id, T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        // Menjamo ceo dokument u bazi onim koji ima isti ID
        await _collection.ReplaceOneAsync(e => e.Id == id, entity);
    }

    public async Task DeleteAsync(string id)
    {
        await _collection.DeleteOneAsync(e => e.Id == id);
    }
}