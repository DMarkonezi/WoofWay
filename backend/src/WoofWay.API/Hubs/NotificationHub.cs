using Microsoft.AspNetCore.SignalR;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace WoofWay.API.Hubs;

public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
         var userId = Context.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        Console.WriteLine($"USER FROM CLAIMS: {userId}");
        Console.WriteLine($"USERIDENTIFIER: {Context.UserIdentifier}");

        Console.WriteLine("AUTH USER: " + Context.UserIdentifier);

        foreach (var c in Context.User?.Claims ?? [])
            Console.WriteLine($"{c.Type} = {c.Value}");

        Console.WriteLine($"[SignalR] Connected userId: {userId}");

        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
            Console.WriteLine($"[SignalR Notif NotificationHub] Added to group: user-{userId}");
        }
        else
        {
            Console.WriteLine("[SignalR Notif NotificationHub] WARNING: userId is NULL!");
        }

        await base.OnConnectedAsync();
    }
}