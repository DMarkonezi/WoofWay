using WoofWay.Application.Interfaces.Handlers;
using WoofWay.Application.Interfaces.Services;

namespace WoofWay.Application.Events.Adoption;

public class AdoptionCreatedHandler : IEventHandler<AdoptionRequestCreatedEvent>
{
    //private readonly IChatService _chatService;
    private readonly INotificationService _notificationService;

    public AdoptionCreatedHandler(
        INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task HandleAsync(AdoptionRequestCreatedEvent e)
    {
        await _notificationService.SendAsync(
            e.ShelterId,
            "Novi zahtev",
            "{e.AdopterName} je poslao zahtev za udomljavanje psa {e.DogName}",
            $"/dogs/{e.DogId}"
        );
    }
}