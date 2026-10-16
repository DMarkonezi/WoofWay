using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;

namespace WoofWay.Application.Services;

public class ChatService : IChatService
{
    private readonly IChatRepository _chatRepository;
    private readonly IRepository<SittingRequest> _sittingRepo;
    private readonly IRepository<AdoptionRequest> _adoptionRepo;
    private readonly IRepository<SittingOffer> _offerRepo;

    public ChatService(
        IChatRepository chatRepository, 
        IRepository<SittingRequest> sittingRepo,
        IRepository<AdoptionRequest> adoptionRepo,
        IRepository<SittingOffer> offerRepo)
    {
        _chatRepository = chatRepository;
        _sittingRepo = sittingRepo;
        _adoptionRepo = adoptionRepo;
        _offerRepo = offerRepo;
    }

    public async Task<IEnumerable<ChatRoom>> GetMyRoomsAsync(string userId)
    {
        var allRooms = await _chatRepository.GetRoomsByUserIdAsync(userId);
        var validRooms = new List<ChatRoom>();

        foreach (var room in allRooms)
        {
            var sittingRequest = await _sittingRepo.GetByIdAsync(room.RequestId);
            if (sittingRequest != null)
            {
                if (sittingRequest.Status == RequestStatus.Approved) 
                {
                    validRooms.Add(room);
                }
                continue;
            }

            var adoptionRequest = await _adoptionRepo.GetByIdAsync(room.RequestId);
            if (adoptionRequest != null)
            {
                if (adoptionRequest.Status == RequestStatus.Approved)
                {
                    validRooms.Add(room);
                }
            }
        }

        return validRooms;
    }


    public async Task<ChatRoom> GetOrCreateRoomAsync(string requestId, string type, string currentUserId)
    {
        var existingRoom = await _chatRepository.GetRoomByRequestIdAsync(requestId);
        if (existingRoom != null) return existingRoom;

        List<string> participants = new();

        if (type == "Sitting")
        {
            var request = await _sittingRepo.GetByIdAsync(requestId);
            if (request == null || request.Status != RequestStatus.Approved)
                throw new UnauthorizedAccessException("Chat je moguć samo za odobrene zahteve.");
                
            var offer = await _offerRepo.GetByIdAsync(request.SittingOfferId);
            participants.Add(request.OwnerId);
            participants.Add(offer.SitterId);
        }
        else if (type == "Adoption")
        {
            var request = await _adoptionRepo.GetByIdAsync(requestId);
            if (request == null || request.Status != RequestStatus.Approved)
                throw new UnauthorizedAccessException("Chat je moguć samo za odobrene zahteve.");
                
            participants.Add(request.AdopterId);
            participants.Add(request.ShelterId);
        }
        else
        {
            throw new ArgumentException("Nepoznat tip zahteva.");
        }

        if (!participants.Contains(currentUserId))
            throw new UnauthorizedAccessException("Nemate pristup ovom chatu.");

        var newRoom = new ChatRoom
        {
            RequestId = requestId,
            Participants = participants,
            LastMessageAt = DateTime.UtcNow,
            LastMessagePreview = "Chat započet"
        };

        await _chatRepository.CreateRoomAsync(newRoom);
        return newRoom;
    }

    public async Task<IEnumerable<ChatMessage>> GetMessagesAsync(string roomId, string userId)
    {
        var room = await _chatRepository.GetRoomByIdAsync(roomId);
        if (room == null || !room.Participants.Contains(userId))
            throw new UnauthorizedAccessException("Nemate pristup ovoj sobi.");

        return await _chatRepository.GetMessagesByRoomIdAsync(roomId);
    }

    public async Task<ChatMessage> SendMessageAsync(string roomId, string senderId, string content)
    {
        var message = new ChatMessage 
        { 
            ChatRoomId = roomId, 
            SenderId = senderId, 
            Content = content, 
            Timestamp = DateTime.UtcNow 
        };
        await _chatRepository.AddMessageAsync(message);

        var room = await _chatRepository.GetRoomByIdAsync(roomId);
        if (room != null)
        {
            room.LastMessagePreview = content;
            room.LastMessageAt = DateTime.UtcNow;
            await _chatRepository.UpdateRoomAsync(roomId, room);
        }

        return message;
    }

    
}