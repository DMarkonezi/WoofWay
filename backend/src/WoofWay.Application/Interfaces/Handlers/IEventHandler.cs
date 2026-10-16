using WoofWay.Domain.Common;

namespace WoofWay.Application.Interfaces.Handlers;

public interface IEventHandler<in TEvent>
    where TEvent : IDomainEvent
{
    Task HandleAsync(TEvent domainEvent);
}