using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WoofWay.Application.DTOs.AdoptionRequests;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Domain.Enums;

namespace WoofWay.API.Controllers;

[ApiController]
[Route("api/adoption-requests")]
[Authorize]
public class AdoptionRequestsController : ControllerBase
{
    private readonly IAdoptionRequestService _adoptionService;

    public AdoptionRequestsController(IAdoptionRequestService adoptionService)
    {
        _adoptionService = adoptionService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<string>>> Create([FromBody] CreateAdoptionRequestRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var response = await _adoptionService.CreateAsync(request, userId);
        
        return response.Success ? Ok(response) : BadRequest(response);
    }

    [HttpGet("my-requests")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AdoptionRequestResponse>>>> GetMyRequests()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var response = await _adoptionService.GetMyRequestsAsync(userId, UserRole.Shelter);
        
        return Ok(response);
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ApiResponse<string>>> UpdateStatus(string id, [FromBody] string status)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var response = await _adoptionService.UpdateStatusAsync(id, status, userId);
        
        return response.Success ? Ok(response) : BadRequest(response);
    }
}