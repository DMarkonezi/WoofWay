using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WoofWay.Application.DTOs.Auth;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.DTOs.Shelter;
using WoofWay.Application.DTOs.SittingOffers;
using WoofWay.Application.Interfaces.Services;

namespace WoofWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize(Roles = "Admin")] // Pretpostavljam da imaš ulogu Admin
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly ILogger<AdminController> _logger;

    public AdminController(IAdminService adminService, ILogger<AdminController> logger)
    {
        _adminService = adminService;
        _logger = logger;
    }

    [HttpGet("shelters/pending")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<PendingShelterResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<PendingShelterResponse>>>> GetPendingShelters()
    {
        var response = await _adminService.GetPendingSheltersAsync();
        return Ok(response);
    }

    [HttpPost("shelters/{id}/approve")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<string>>> ApproveShelter(string id)
    {
        var response = await _adminService.ApproveShelterAsync(id);
        if (!response.Success) return BadRequest(response);
        return Ok(response);
    }

    [HttpDelete("shelters/{id}/reject")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<string>>> RejectShelter(string id)
    {
        var response = await _adminService.RejectShelterAsync(id);
        if (!response.Success) return NotFound(response);
        return Ok(response);
    }

    [HttpGet("users")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserResponse>>>> GetAllUsers()
    {
        var response = await _adminService.GetAllUsersAsync();
        return Ok(response);
    }

    [HttpDelete("users/{id}")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<string>>> DeleteUser(string id)
    {
        var response = await _adminService.DeleteUserAsync(id);
        if (!response.Success) return NotFound(response);
        return Ok(response);
    }

    [HttpGet("offers")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<SittingOfferResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<SittingOfferResponse>>>> GetAllOffers()
    {
        var response = await _adminService.GetAllOffersAsync();
        return Ok(response);
    }

    [HttpDelete("offers/{id}")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<string>>> DeleteOffer(string id)
    {
        var response = await _adminService.DeleteOfferAsync(id);
        if (!response.Success) return NotFound(response);
        return Ok(response);
    }
}