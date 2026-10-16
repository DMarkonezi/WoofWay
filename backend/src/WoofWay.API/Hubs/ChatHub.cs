using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using WoofWay.Application.Interfaces.Services;
using System.Security.Claims;
using Serilog;

namespace WoofWay.API.Hubs;

[Authorize]
public class ChatHub : Hub
{   
    private readonly IChatService _chatService;

    public ChatHub(IChatService chatService)
    {
        _chatService = chatService;
    }

    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"[DEBUG] Client connected: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"[DEBUG] Client disconnected: {Context.ConnectionId}");
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinRoom(string roomId)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        
        Console.WriteLine($"[DEBUG] User {userId} (Connection: {Context.ConnectionId}) joined room: {roomId}");
    }

    public async Task LeaveRoom(string roomId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
        Console.WriteLine($"[DEBUG] Client {Context.ConnectionId} left room: {roomId}");
    }

    public async Task SendMessage(string roomId, string content)
    {
        Console.WriteLine($"[DEBUG] ChatHub: SendMessage requested. Room: {roomId}, Content: {content}");

        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId)) 
        {
            Console.WriteLine("[DEBUG] ChatHub: FAILED - UserID is null! Check if authentication is working.");
            return;
        }

        try 
        {
            var message = await _chatService.SendMessageAsync(roomId, userId, content);
            
            Console.WriteLine($"[DEBUG] ChatHub: Message saved in DB. Message ID: {message.Id}. Broadcasting to group: {roomId}...");
            
            await Clients.Group(roomId).SendAsync("ReceiveMessage", message);
            
            Console.WriteLine("[DEBUG] ChatHub: Message successfully broadcasted to group.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DEBUG] ChatHub: EXCEPTION - {ex.Message}");
            Console.WriteLine($"[DEBUG] StackTrace: {ex.StackTrace}");
        }
    }
}