using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WoofWay.Application.DTOs.SittingRequests;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Domain.Enums;

namespace WoofWay.API.Controllers;

[ApiController]
//[Route("api/[controller]")]
[Route("api/sitting-requests")]
[Produces("application/json")]
[Authorize]
public class SittingRequestsController : ControllerBase
{
    private readonly ISittingRequestService _service;
    private readonly ILogger<SittingRequestsController> _logger;

    public SittingRequestsController(ISittingRequestService service, ILogger<SittingRequestsController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet("my")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<SittingRequestResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<SittingRequestResponse>>>> GetMyRequests()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleString = User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(roleString))
            return Unauthorized();

        var role = Enum.Parse<UserRole>(roleString);
        var response = await _service.GetMyRequestsAsync(userId, role);
        
        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = "Owner")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<string>>> Create([FromBody] CreateSittingRequestRequest request)
    {
        var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (ownerId == null) return Unauthorized();

        var response = await _service.CreateAsync(request, ownerId);
        
        if (!response.Success) return BadRequest(response);
        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Sitter")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<string>>> UpdateStatus(string id, [FromBody] StatusUpdateRequest request)
    {
        var sitterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (sitterId == null) return Unauthorized();

        var response = await _service.UpdateStatusAsync(id, request.Status, sitterId);
        
        if (!response.Success) return BadRequest(response);
        return Ok(response);
    }

    [HttpPatch("{id}/cancel")]
    [Authorize(Roles = "Owner")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<string>>> CancelRequest(string id)
    {
        var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (ownerId == null) return Unauthorized();

        var response = await _service.CancelRequestAsync(id, ownerId);
        
        if (!response.Success) return BadRequest(response);
        return Ok(response);
    }
}