using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WoofWay.Application.DTOs.Shelter;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Interfaces.Services;

namespace WoofWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class SheltersController : ControllerBase
{
    private readonly IShelterService _service;
    private readonly ILogger<SheltersController> _logger;

    public SheltersController(IShelterService service, ILogger<SheltersController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ShelterResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<ShelterResponse>>>> GetAll()
    {
        var response = await _service.GetAllVerifiedAsync();
        return Ok(response);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ShelterResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ShelterResponse>>> GetById(string id)
    {
        var response = await _service.GetByIdAsync(id);
        
        if (!response.Success) 
            return NotFound(response);
            
        return Ok(response);
    }
}