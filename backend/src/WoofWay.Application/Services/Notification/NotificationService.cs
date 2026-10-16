using WoofWay.Application.Interfaces.Publishers;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Domain.Entities;

namespace WoofWay.Application.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationPublisher _notificationPublisher;
    private readonly INotificationRepository _notificationRepository;

    public NotificationService(
        INotificationRepository notificationRepository,
        INotificationPublisher notificationPublisher
        )
    {
        _notificationRepository = notificationRepository;
        _notificationPublisher = notificationPublisher;
    }

    public async Task SendAsync(string userId, string title, string content, string? linkUrl = null)
    {
        var notification = new Notification 
        { 
            UserId = userId,
            Title = title,
            Content = content, 
            LinkUrl = linkUrl 
        };
        
        await _notificationRepository.CreateAsync(notification);

        await _notificationPublisher.PublishAsync(notification);
    }

    public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId)
    {
        return await _notificationRepository.GetUserNotificationsAsync(userId);
    }

    public async Task MarkAsReadAsync(string notificationId)
    {
        var notification = await _notificationRepository.GetByIdAsync(notificationId);
        if (notification != null)
        {
            notification.IsRead = true;
            await _notificationRepository.UpdateAsync(notificationId, notification);
        }
    }
}