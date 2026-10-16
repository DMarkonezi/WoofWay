using WoofWay.Domain.Entities;

namespace WoofWay.Application.Interfaces.Repositories;

public interface INotificationRepository : IRepository<Notification>
{
    Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId, int limit = 20);
}