using Hirebase.Domain.Entities;

namespace Hirebase.Application.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}