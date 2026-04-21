using Hirebase.Domain.Entities.Auth;

namespace Hirebase.Application.Interfaces;

public interface IAuthRepository
{
    Task<User?> FindByEmail(string email);
    Task<User> CreateUser(User user);
    Task SaveRefreshToken(RefreshToken refreshToken);
    Task <RefreshToken?> GetRefreshToken(string token);
    Task RevokeRefreshToken(RefreshToken token);

    Task RevokeFamily(Guid familyId);

    Task RevokeAllByUserId(Guid userId);

}