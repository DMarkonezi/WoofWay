using System.Text.Json;
using Microsoft.Extensions.Configuration;
using WoofWay.Application.Interfaces.Services.ComputerVision;

namespace WoofWay.Infrastructure.Services;

public class ComputerVisionService : IComputerVisionService
{
    private readonly HttpClient _httpClient;
    private readonly string _cvServiceUrl;

    public ComputerVisionService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _cvServiceUrl = configuration["CvService:BaseUrl"] ?? "http://localhost:5001";
    }

    public async Task<ComputerVisionResult?> PredictAsync(string imageUrl)
    {
        try
        {
            var imageBytes = await _httpClient.GetByteArrayAsync(imageUrl);

            using var content = new MultipartFormDataContent();
            using var imageContent = new ByteArrayContent(imageBytes);
            imageContent.Headers.ContentType =
                new System.Net.Http.Headers.MediaTypeHeaderValue("image/jpeg");
            content.Add(imageContent, "file", "dog.jpg");

            var response = await _httpClient.PostAsync(
                $"{_cvServiceUrl}/predict", content
            );

            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<CvResponse>(json,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (result == null) return null;

            return new ComputerVisionResult(
                result.ImageUrl,
                result.Predictions.Select(p =>
                    new ComputerVisionPrediction(p.Breed, p.Confidence)
                ).ToList()
            );
        }
        catch
        {
            return null;
        }
    }

    private record CvResponse(
        string ImageUrl,
        List<CvPrediction> Predictions,
        string Status
    );

    private record CvPrediction(
        string Breed,
        float Confidence
    );
}