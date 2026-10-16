using WoofWay.Domain.Entities;

namespace WoofWay.Application.Interfaces.Services;
public interface IChatService
{
    // Sidebar logika
    Task<IEnumerable<ChatRoom>> GetMyRoomsAsync(string userId);
    
    // Inicijacija (poziva se kad korisnik klikne "Chat" na zahtevu)
    Task<ChatRoom> GetOrCreateRoomAsync(string requestId, string type, string currentUserId);
    
    // Poruke
    Task<IEnumerable<ChatMessage>> GetMessagesAsync(string roomId, string userId);
    Task<ChatMessage> SendMessageAsync(string roomId, string senderId, string content);
}   