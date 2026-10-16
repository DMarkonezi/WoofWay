using WoofWay.Domain.Entities;

namespace WoofWay.Application.Interfaces.Repositories;

public interface ISittingOfferRepository : IRepository<SittingOffer>
{
    IQueryable<SittingOffer> GetActiveOffers();
    IQueryable<SittingOffer> GetOffersBySitter(string sitterId);
    IQueryable<SittingOffer> GetOffersByMaxPrice(decimal maxPrice);
}