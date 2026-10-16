using WoofWay.Domain.Common;

namespace WoofWay.Application.Common.Interfaces;

public interface IEventDispatcher
{
    Task PublishAsync<TEvent>(TEvent domainEvent)
        where TEvent : IDomainEvent;
}