using WoofWay.API.Services.Auth;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Application.Services.Auth;

namespace WoofWay.API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IJwtService, JwtService>();
        
        return services;
    }
}