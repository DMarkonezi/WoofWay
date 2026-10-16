using WoofWay.Application.Interfaces.Handlers;
using WoofWay.Application.Interfaces.Services;

namespace WoofWay.Application.Events.Sitting;

public class SittingRequestCreatedHandler : IEventHandler<SittingRequestCreatedEvent>
{
    private readonly INotificationService _notificationService;

    public SittingRequestCreatedHandler(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task HandleAsync(SittingRequestCreatedEvent e)
    {
        await _notificationService.SendAsync(
            e.SitterId,
            "Novi zahtev za čuvanje",
            $"{e.OwnerName} je poslao zahtev za čuvanje psa",
            $"/sitting/{e.SittingRequestId}"
        );
    }
}