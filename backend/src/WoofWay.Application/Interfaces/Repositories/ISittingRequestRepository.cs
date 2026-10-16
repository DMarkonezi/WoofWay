using WoofWay.Domain.Entities;
using WoofWay.Domain.Enums;

namespace WoofWay.Application.Interfaces.Repositories;

public interface ISittingRequestRepository : IRepository<SittingRequest>
{
    IQueryable<SittingRequest> GetRequestsForSitter(string sitterId);
    IQueryable<SittingRequest> GetRequestsByOwner(string ownerId);
    IQueryable<SittingRequest> GetRequestsByStatus(RequestStatus status);
    IQueryable<SittingRequest> GetCompletedRequestsForSitter(string sitterId);
}