using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WoofWay.Application.DTOs.Chat;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Interfaces.Services;

namespace WoofWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(IChatService chatService, ILogger<ChatController> logger)
    {
        _chatService = chatService;
        _logger = logger;
    }

    [HttpGet("rooms")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ChatRoomResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<ChatRoomResponse>>>> GetMyRooms()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var rooms = await _chatService.GetMyRoomsAsync(userId);

        var response = rooms.Select(r => new ChatRoomResponse(
            r.Id,
            r.RequestId,
            r.Participants,
            r.LastMessagePreview,
            r.LastMessageAt
        ));

        return Ok(ApiResponse<IEnumerable<ChatRoomResponse>>.Ok(response));
    }

    [HttpPost("rooms/open")]
    [ProducesResponseType(typeof(ApiResponse<ChatRoomResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<ChatRoomResponse>>> OpenRoom(
        [FromBody] OpenChatRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        try
        {
            var room = await _chatService.GetOrCreateRoomAsync(
                request.RequestId,
                request.Type,
                userId
            );

            var response = new ChatRoomResponse(
                room.Id,
                room.RequestId,
                room.Participants,
                room.LastMessagePreview,
                room.LastMessageAt
            );

            return Ok(ApiResponse<ChatRoomResponse>.Ok(response));
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(ApiResponse<string>.Fail(ex.Message));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<string>.Fail(ex.Message));
        }
    }

    [HttpGet("rooms/{roomId}/messages")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ChatMessageResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<ChatMessageResponse>>>> GetMessages(
        string roomId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        try
        {
            var messages = await _chatService.GetMessagesAsync(roomId, userId);

            var response = messages.Select(m => new ChatMessageResponse(
                m.Id,
                m.ChatRoomId,
                m.SenderId,
                m.Content,
                m.IsRead,
                m.Timestamp
            ));

            return Ok(ApiResponse<IEnumerable<ChatMessageResponse>>.Ok(response));
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(ApiResponse<string>.Fail(ex.Message));
        }
    }
}