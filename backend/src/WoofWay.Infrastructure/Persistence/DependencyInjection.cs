using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WoofWay.Application.Common.Interfaces;
using WoofWay.Application.Events.Adoption;
using WoofWay.Application.Events.Sitting;
using WoofWay.Application.Interfaces.Handlers;
using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Application.Interfaces.Services;
using WoofWay.Application.Interfaces.Services.ComputerVision;
using WoofWay.Application.Services;
using WoofWay.Infrastructure.Events;
using WoofWay.Infrastructure.Persistence;
using WoofWay.Infrastructure.Repositories;
using WoofWay.Infrastructure.Repositories.Common;
using WoofWay.Infrastructure.Services;

namespace WoofWay.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<MongoDbContext>();

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IDogRepository, DogRepository>();
        services.AddScoped<IShelterRepository, ShelterRepository>();
        services.AddScoped<ISittingOfferRepository, SittingOfferRepository>();
        services.AddScoped<ISittingRequestRepository, SittingRequestRepository>();
        
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IChatRepository, ChatRepository>();

        services.AddHttpClient<IComputerVisionService, ComputerVisionService>();

        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IAdoptionRequestService, AdoptionRequestService>();
        services.AddScoped<IBreedService, BreedService>();
        services.AddScoped<IEventDispatcher, EventDispatcher>();

        services.AddScoped<IEventHandler<AdoptionRequestCreatedEvent>, AdoptionCreatedHandler>();
        services.AddScoped<IEventHandler<AdoptionRequestApprovedEvent>, AdoptionApprovedHandler>();
        services.AddScoped<IEventHandler<SittingRequestCreatedEvent>, SittingRequestCreatedHandler>();
        services.AddScoped<IEventHandler<SittingRequestApprovedEvent>, SittingRequestApprovedHandler>();
        
        services.AddScoped<IEventDispatcher, EventDispatcher>();

        return services;
    }
}