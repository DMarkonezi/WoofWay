namespace WoofWay.Application.DTOs.Breeds;

public class BreedJsonRoot
{
    public List<BreedItem> Breeds { get; set; } = new();
}

public class BreedItem
{
    public string Id { get; set; } = null!;
    public string English { get; set; } = null!;
    public string Translation { get; set; } = null!;
}