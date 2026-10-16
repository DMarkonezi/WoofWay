using WoofWay.Domain.Entities;

namespace WoofWay.Application.Interfaces.Repositories;

public interface IShelterRepository : IRepository<Shelter>
{
    IQueryable<Shelter> GetVerifiedShelters();
    IQueryable<Shelter> GetUnverifiedShelters(); 
    Task<Shelter> GetByUserIdAsync(string userId);
}