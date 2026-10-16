namespace WoofWay.Domain.ValueObjects;

public class Availability
{
    public string DayOfWeek { get; set; } = null!; // "Monday", "Sunday"...
    public string FromTime { get; set; } = null!;  // "08:00"
    public string ToTime { get; set; } = null!;    // "17:00"
    public bool IsSpecialDay { get; set; } = false; // Za praznike ili specifične datume
    public string? Note { get; set; }               
}