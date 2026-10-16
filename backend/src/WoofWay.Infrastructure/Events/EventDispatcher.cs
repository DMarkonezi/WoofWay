using Microsoft.Extensions.DependencyInjection;
using WoofWay.Application.Common.Interfaces;
using WoofWay.Application.Interfaces.Handlers;
using WoofWay.Domain.Common;

namespace WoofWay.Infrastructure.Events;

public class EventDispatcher : IEventDispatcher
{
    private readonly IServiceProvider _serviceProvider;

    public EventDispatcher(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task PublishAsync<TEvent>(TEvent domainEvent)
        where TEvent : IDomainEvent
    {
        var handlers =
            _serviceProvider
                .GetServices<IEventHandler<TEvent>>();

        foreach (var handler in handlers)
        {
            await handler.HandleAsync(domainEvent);
        }
    }
}