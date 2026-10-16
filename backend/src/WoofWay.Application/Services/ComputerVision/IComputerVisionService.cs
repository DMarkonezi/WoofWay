namespace WoofWay.Application.Interfaces.Services.ComputerVision;

public interface IComputerVisionService
{
    Task<ComputerVisionResult?> PredictAsync(string imageUrl);
}

public record ComputerVisionPrediction(string Breed, float Confidence);

public record ComputerVisionResult(
    string ImageUrl,
    List<ComputerVisionPrediction> Predictions
);