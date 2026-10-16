using WoofWay.Domain.Entities;

namespace WoofWay.Application.Interfaces.Publishers;

public interface INotificationPublisher
{
    Task PublishAsync(Notification notification);
}