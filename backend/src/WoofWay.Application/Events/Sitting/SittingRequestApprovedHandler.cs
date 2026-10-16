using WoofWay.Application.Interfaces.Handlers;
using WoofWay.Application.Interfaces.Services;

namespace WoofWay.Application.Events.Sitting;

public class SittingRequestApprovedHandler : IEventHandler<SittingRequestApprovedEvent>
{
    private readonly INotificationService _notificationService;

    public SittingRequestApprovedHandler(
        INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task HandleAsync(SittingRequestApprovedEvent e)
    {
        await _notificationService.SendAsync(
            e.OwnerId,
            "Zahtev odobren",
            $"Čuvar {e.SitterName} je prihvatio vaš zahtev za čuvanje psa",
            $"/sitting/{e.SittingRequestId}"
        );
    }
}