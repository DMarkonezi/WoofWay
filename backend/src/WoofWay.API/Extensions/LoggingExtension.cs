namespace WoofWay.API.Extensions;

using Serilog;
using Serilog.Events;

public static class LoggingExtensions
{
    public static void ConfigureWoofWayLogging(this WebApplicationBuilder builder)
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext} - {Message:lj}{NewLine}{Exception}")
            .WriteTo.Seq("http://localhost:5341") // Saljemo logove direktno u Seq kontejner preko localhost-a
            .CreateLogger();

        builder.Host.UseSerilog();
    }
}