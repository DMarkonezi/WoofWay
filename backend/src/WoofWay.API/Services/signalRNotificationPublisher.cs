using Microsoft.AspNetCore.SignalR;
using WoofWay.Application.Interfaces.Publishers;
using WoofWay.Domain.Entities;
using WoofWay.API.Hubs;

namespace WoofWay.API.Services;

public class SignalRNotificationPublisher : INotificationPublisher
{
    private readonly IHubContext<NotificationHub> _hub;

    public SignalRNotificationPublisher(IHubContext<NotificationHub> hub)
    {
        _hub = hub;
    }

    public async Task PublishAsync(Notification notification)
    {
        if (notification == null)
            return;

        await _hub.Clients.User(notification.UserId)
            .SendAsync("ReceiveNotification", new
            {
                id = notification.Id,
                title = notification.Title,
                content = notification.Content,
                linkUrl = notification.LinkUrl,
                isRead = notification.IsRead,
                createdAt = notification.CreatedAt
            });
    }
}