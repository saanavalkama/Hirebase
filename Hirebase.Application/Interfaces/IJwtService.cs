using Hirebase.Domain.Entities;

namespace Hirebase.Application.Interfaces;

public interface IJwtService
{
    string GenrerateAccessToken(User user);
    string GenerateRefreshToken();
}