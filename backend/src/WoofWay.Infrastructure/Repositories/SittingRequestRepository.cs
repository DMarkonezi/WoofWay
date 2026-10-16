using WoofWay.Application.Interfaces.Repositories;
using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;
using WoofWay.Infrastructure.Persistence;
using WoofWay.Infrastructure.Repositories.Common;

namespace WoofWay.Infrastructure.Repositories;

public class SittingRequestRepository : Repository<SittingRequest>, ISittingRequestRepository
{
    public SittingRequestRepository(MongoDbContext context) : base(context)
    {
    }

    public IQueryable<SittingRequest> GetRequestsForSitter(string sitterId) 
        => GetQueryable().Where(sr => sr.SittingOfferId == sitterId);

    public IQueryable<SittingRequest> GetRequestsByOwner(string ownerId) 
        => GetQueryable().Where(sr => sr.OwnerId == ownerId);

    public IQueryable<SittingRequest> GetRequestsByStatus(RequestStatus status) 
        => GetQueryable().Where(sr => sr.Status == status);

    public IQueryable<SittingRequest> GetCompletedRequestsForSitter(string sitterId) 
    {
        return GetQueryable().Where(sr => 
            sr.SittingOfferId == sitterId && 
            sr.Status == RequestStatus.Completed
    );
}
}