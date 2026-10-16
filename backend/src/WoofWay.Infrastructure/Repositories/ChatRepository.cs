using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Domain.Entities;

namespace WoofWay.Infrastructure.Repositories;

public class ChatRepository : IChatRepository
{
    private readonly IRepository<ChatRoom> _roomRepo;
    private readonly IRepository<ChatMessage> _messageRepo;

    public ChatRepository(IRepository<ChatRoom> roomRepo, IRepository<ChatMessage> messageRepo)
    {
        _roomRepo = roomRepo;
        _messageRepo = messageRepo;
    }

    public async Task<IEnumerable<ChatRoom>> GetRoomsByUserIdAsync(string userId)
    {
        return _roomRepo.GetQueryable()
            .Where(r => r.Participants.Contains(userId))
            .OrderByDescending(r => r.LastMessageAt)
            .ToList();
    }

    public async Task<ChatRoom?> GetRoomByIdAsync(string roomId) 
        => await _roomRepo.GetByIdAsync(roomId);

    public async Task<ChatRoom?> GetRoomByRequestIdAsync(string requestId)
    {
        return _roomRepo.GetQueryable()
            .FirstOrDefault(r => r.RequestId == requestId);
    }

    public async Task CreateRoomAsync(ChatRoom room) 
        => await _roomRepo.CreateAsync(room);

    public async Task UpdateRoomAsync(string roomId, ChatRoom room) 
        => await _roomRepo.UpdateAsync(roomId, room);

    public async Task<IEnumerable<ChatMessage>> GetMessagesByRoomIdAsync(string roomId, int limit = 50)
    {
        return _messageRepo.GetQueryable()
            .Where(m => m.ChatRoomId == roomId)
            .OrderBy(m => m.Timestamp)
            .Take(limit)
            .ToList();
    }

    public async Task AddMessageAsync(ChatMessage message) 
        => await _messageRepo.CreateAsync(message);
}