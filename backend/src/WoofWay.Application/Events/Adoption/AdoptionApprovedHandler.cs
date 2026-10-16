using WoofWay.Application.Interfaces.Handlers;
using WoofWay.Application.Interfaces.Services;

namespace WoofWay.Application.Events.Adoption;

public class AdoptionApprovedHandler : IEventHandler<AdoptionRequestApprovedEvent>
{
    private readonly IChatService _chatService;
    private readonly INotificationService _notificationService;

    public AdoptionApprovedHandler(
        IChatService chatService,
        INotificationService notificationService)
    {
        _chatService = chatService;
        _notificationService = notificationService;
    }

    public async Task HandleAsync(AdoptionRequestApprovedEvent e)
    {
        await _chatService.GetOrCreateRoomAsync(
            e.RequestId,
            "Adoption",
            e.ShelterId
        );

        await _notificationService.SendAsync(
            e.AdopterId,
            "Zahtev odobren",
            "Azil je odobrio vaš zahtev",
            $"/chat"
        );
    }
}