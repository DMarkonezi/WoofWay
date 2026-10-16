using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WoofWay.Application.DTOs.Dogs;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Interfaces.Services;

namespace WoofWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class DogsController : ControllerBase
{
    private readonly IDogService _dogService;
    private readonly ILogger<DogsController> _logger;

    public DogsController(IDogService dogService, ILogger<DogsController> logger)
    {
        _dogService = dogService;
        _logger = logger;
    }

    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<DogResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<DogResponse>>>> GetAll(
        [FromQuery] string? status, 
        [FromQuery] string? city)
    {
        var response = await _dogService.GetAllAsync(status, city);
        return Ok(response);
    }

    [HttpGet("my")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<DogResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<DogResponse>>>> GetMy()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var response = await _dogService.GetMyAsync(userId);
        return Ok(response);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<DogResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<DogResponse>>> GetById(string id)
    {
        var response = await _dogService.GetByIdAsync(id);
        if (!response.Success) return NotFound(response);
        return Ok(response);
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<string>>> Create([FromBody] CreateDogRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var response = await _dogService.CreateAsync(request, userId);
        return CreatedAtAction(nameof(GetById), new { id = response.Data }, response);
    }

    [HttpPatch("{id}/status")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<string>>> UpdateStatus(string id, [FromBody] UpdateStatusRequest request)
    {
        // Opcionalno: ovde u servisu proveri da li je korisnik vlasnik psa
        var response = await _dogService.UpdateStatusAsync(id, request.Status);
        
        if (!response.Success) return BadRequest(response);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<string>>> Delete(string id)
    {
        var response = await _dogService.DeleteAsync(id);
        if (!response.Success) return NotFound(response);
        return Ok(response);
    }

    [HttpPost("spotted")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<SpottedDogResponse>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<SpottedDogResponse>>> ReportSpotted(
        [FromBody] SpottedDogRequest request)
    {
        var response = await _dogService.ReportSpottedAsync(request);
        if (!response.Success) return BadRequest(response);
        return StatusCode(StatusCodes.Status201Created, response);
    }
}