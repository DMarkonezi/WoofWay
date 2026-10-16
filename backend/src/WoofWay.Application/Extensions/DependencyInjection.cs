using Microsoft.Extensions.DependencyInjection;
using WoofWay.Application.Events.Adoption;
using WoofWay.Application.Interfaces.Handlers;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Application.Services;
using WoofWay.Application.Services.Auth;

namespace WoofWay.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IDogService, DogService>();
        services.AddScoped<ISittingOfferService, SittingOfferService>();
        services.AddScoped<ISittingRequestService, SittingRequestService>();
        services.AddScoped<IShelterService, ShelterService>();
        services.AddScoped<IChatService, ChatService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAdminService, AdminService>();

        services.AddScoped<
            IEventHandler<AdoptionRequestCreatedEvent>,
            AdoptionCreatedHandler>();

        services.AddScoped<
            IEventHandler<AdoptionRequestApprovedEvent>,
            AdoptionApprovedHandler>();

        return services;
    }
}