using WoofWay.Domain.Entities;

namespace WoofWay.Application.Interfaces.Services;

public interface IJwtService
{
    string GenerateToken(User user);
}