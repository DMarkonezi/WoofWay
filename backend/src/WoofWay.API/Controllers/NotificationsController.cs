using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Application.DTOs.Notifiactions;

namespace WoofWay.API.Controllers;

[ApiController]
[Route("api/notifications")]
[Produces("application/json")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _service;

    public NotificationsController(INotificationService service)
    {
        _service = service;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<NotificationResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<NotificationResponse>>>> GetMyNotifications()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized(ApiResponse<string>.Fail("User not authenticated."));

        var response = await _service.GetUserNotificationsAsync(userId);
        return Ok(response);
    }

    [HttpPost("{id}/read")]
    public async Task<ActionResult<ApiResponse<string>>> MarkAsRead(string id)
    {
        try
        {
            await _service.MarkAsReadAsync(id);
            return Ok(ApiResponse<string>.Ok("Success"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<string>.Fail("Notification not found"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<string>.Fail(ex.Message));
        }
    }
}