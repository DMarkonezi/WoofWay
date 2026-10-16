using WoofWay.Domain.Entities;

namespace WoofWay.Application.Interfaces.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
}