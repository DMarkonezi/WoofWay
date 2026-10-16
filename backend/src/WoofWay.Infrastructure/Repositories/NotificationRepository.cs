using MongoDB.Driver;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Domain.Entities;
using WoofWay.Infrastructure.Persistence;
using WoofWay.Infrastructure.Repositories.Common;

namespace WoofWay.Infrastructure.Repositories;

public class NotificationRepository : Repository<Notification>, INotificationRepository
{
    public NotificationRepository(MongoDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId, int limit = 20)
    {
        return await _collection.Find(n => n.UserId == userId)
                                .SortByDescending(n => n.CreatedAt)
                                .Limit(limit)
                                .ToListAsync();
    }
}