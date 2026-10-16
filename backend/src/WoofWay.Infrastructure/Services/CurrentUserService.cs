// src/WoofWay.Infrastructure/Services/CurrentUserService.cs
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using WoofWay.Application.Interfaces.Services;

namespace WoofWay.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        UserId = httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }

    public string? UserId { get; }
    public bool IsAuthenticated => UserId != null;
}