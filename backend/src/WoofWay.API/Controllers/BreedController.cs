using Microsoft.AspNetCore.Mvc;
using WoofWay.Application.DTOs.Response;
using WoofWay.Application.Interfaces.Services;

namespace WoofWay.API.Controllers;

[ApiController]
[Route("api/breeds")]
public class BreedsController : ControllerBase
{
    private readonly IBreedService _breedService;

    public BreedsController(IBreedService breedService)
    {
        _breedService = breedService;
    }

    [HttpGet("translations")]
    public ActionResult<ApiResponse<Dictionary<string, string>>> GetAllTranslations()
    {
        var translations = _breedService.GetAllTranslations();
        return Ok(ApiResponse<Dictionary<string, string>>.Ok(translations));
    }

    [HttpGet("options")]
    public ActionResult<ApiResponse<IEnumerable<string>>> GetOptions()
    {
        var supportedBreeds = _breedService.GetOptions();
        return Ok(ApiResponse<IEnumerable<string>>.Ok(supportedBreeds));
    }

    [HttpGet("translated-options")]
    public ActionResult<ApiResponse<IEnumerable<object>>> GetTranslatedOptions()
    {
        var options = _breedService.GetTranslatedOptions();
        return Ok(ApiResponse<IEnumerable<object>>.Ok(options));
    }

    [HttpGet("translate")]
    public ActionResult<ApiResponse<string>> GetTranslation([FromQuery] string identifier)
    {
        if (string.IsNullOrEmpty(identifier))
        {
            return BadRequest(ApiResponse<string>.Fail("Identifikator rase je obavezan."));
        }

        var translation = _breedService.GetTranslation(identifier);
        return Ok(ApiResponse<string>.Ok(translation));
    }
}