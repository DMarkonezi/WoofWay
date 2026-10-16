using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WoofWay.Application.DTOs.SittingOffers;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Interfaces.Services;

namespace WoofWay.API.Controllers;

[ApiController]
//[Route("api/[controller]")]
[Route("api/sitting-offers")]
[Produces("application/json")]
public class SittingOffersController : ControllerBase
{
    private readonly ISittingOfferService _service;
    private readonly ILogger<SittingOffersController> _logger;

    public SittingOffersController(ISittingOfferService service, ILogger<SittingOffersController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<SittingOfferResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<SittingOfferResponse>>>> GetAll([FromQuery] string? city)
    {
        var response = await _service.GetAllActiveAsync(city);
        return Ok(response);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<SittingOfferResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<SittingOfferResponse>>> GetById(string id)
    {
        var response = await _service.GetByIdAsync(id);
        if (!response.Success) return NotFound(response);
        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = "Sitter, Shelter")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<string>>> Create([FromBody] CreateSittingOfferRequest request)
    {
        var sitterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (sitterId == null) return Unauthorized();

        var response = await _service.CreateAsync(request, sitterId);
        return CreatedAtAction(nameof(GetById), new { id = response.Data }, response);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Sitter, Shelter")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<string>>> Update(string id, [FromBody] UpdateSittingOfferRequest request)
    {
        var sitterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (sitterId == null) return Unauthorized();

        var response = await _service.UpdateAsync(id, request, sitterId);
        if (!response.Success) return BadRequest(response);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Sitter, Shelter")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<string>>> Delete(string id)
    {
        var sitterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (sitterId == null) return Unauthorized();

        var response = await _service.DeleteAsync(id, sitterId);
        if (!response.Success) return BadRequest(response);
        return Ok(response);
    }

    [HttpGet("my")]
    [Authorize(Roles = "Sitter, Shelter")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<IEnumerable<SittingOfferResponse>>>> GetMy()
    {
        var sitterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (sitterId == null) return Unauthorized();

        var response = await _service.GetMySittingOffersAsync(sitterId);
        return Ok(response);
    }
}