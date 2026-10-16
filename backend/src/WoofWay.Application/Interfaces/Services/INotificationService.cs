using WoofWay.Domain.Entities;

namespace WoofWay.Application.Interfaces.Services;

public interface INotificationService
{
    Task SendAsync(string userId, string title, string content, string? linkUrl = null);
    Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId);
    Task MarkAsReadAsync(string notificationId);
}