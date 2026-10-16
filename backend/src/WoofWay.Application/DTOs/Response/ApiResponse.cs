namespace WoofWay.Application.DTOs.Response;

public class ApiResponse<T>
{
    public bool Success { get; set; } = true;
    public string Message { get; set; } = "Success";
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Success") 
        => new() { Data = data, Message = message };

    public static ApiResponse<T> Fail(string error, string message = "Error") 
        => new() { Success = false, Message = message, Errors = new List<string> { error } };
}