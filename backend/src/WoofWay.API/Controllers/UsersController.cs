using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.DTOs.Users;
using WoofWay.Application.Interfaces.Services;

namespace WoofWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("profile")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserProfileResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<UserProfileResponse>>> GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var response = await _userService.GetProfileAsync(userId);
        if (!response.Success) return NotFound(response);
        
        return Ok(response);
    }

    [HttpPut("profile")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<string>>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var response = await _userService.UpdateProfileAsync(userId, request);
        if (!response.Success) return BadRequest(response);
        
        return Ok(response);
    }

    [HttpPut("shelter-details")]
    [Authorize(Roles = "Shelter")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<string>>> UpdateShelterDetails([FromBody] UpdateShelterDetailsRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var response = await _userService.UpdateShelterDetailsAsync(userId, request);
        if (!response.Success) return BadRequest(response);
        
        return Ok(response);
    }
}