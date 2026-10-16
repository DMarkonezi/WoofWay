using WoofWay.Domain.Entities;

namespace WoofWay.Application.Interfaces.Repositories;

public interface IChatRepository
{
    Task<IEnumerable<ChatRoom>> GetRoomsByUserIdAsync(string userId);
    Task<ChatRoom?> GetRoomByIdAsync(string roomId);
    Task<ChatRoom?> GetRoomByRequestIdAsync(string requestId);
    Task CreateRoomAsync(ChatRoom room);
    Task UpdateRoomAsync(string roomId, ChatRoom room);

    
    Task<IEnumerable<ChatMessage>> GetMessagesByRoomIdAsync(string roomId, int limit = 50);
    Task AddMessageAsync(ChatMessage message);
}