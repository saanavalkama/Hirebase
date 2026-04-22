using Hirebase.Domain.Entities.Auth;

namespace Hirebase.Application.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}