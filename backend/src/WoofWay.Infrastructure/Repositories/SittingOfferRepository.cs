using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Domain.Entities;
using WoofWay.Infrastructure.Persistence;
using WoofWay.Infrastructure.Repositories.Common;

namespace WoofWay.Infrastructure.Repositories;

public class SittingOfferRepository : Repository<SittingOffer>, ISittingOfferRepository
{
    public SittingOfferRepository(MongoDbContext context) : base(context)
    {
    }

    public IQueryable<SittingOffer> GetActiveOffers() 
        => GetQueryable().Where(so => so.IsActive == true);

    public IQueryable<SittingOffer> GetOffersBySitter(string sitterId) 
        => GetQueryable().Where(so => so.SitterId == sitterId);

    public IQueryable<SittingOffer> GetOffersByMaxPrice(decimal maxPrice) 
        => GetQueryable().Where(so => so.PricePerHour <= maxPrice);
}