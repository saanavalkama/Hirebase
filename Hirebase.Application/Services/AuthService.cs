using Hirebase.Application.DTOs.Auth;
using Hirebase.Application.Interfaces;
using Hirebase.Domain.Entities;
using Hirebase.Domain.Enums;
using Hirebase.Domain.Exceptions;

namespace Hirebase.Application.Services;
public class AuthService : IAuthService
{
    private readonly IAuthRepository _repo;
    private readonly IPasswordHasher _hasher;

    private readonly IJwtService _jwt;
    
    public AuthService(IAuthRepository repo, IPasswordHasher hasher, IJwtService jwt)
    {
        _repo = repo;
        _hasher = hasher;
        _jwt = jwt;

    }

    public async Task<AuthResponseDto> Register(RegisterDto dto)
    {
        var existing = await _repo.FindByEmail(dto.Email);
        if(existing != null) throw new ConflictException("Email already in use");

        var role = Enum.Parse<UserRole>(dto.Role, ignoreCase:true);

        var user = new User
        {
            Email = dto.Email,
            PasswordHash = _hasher.Hash(dto.Password),
            Role = role
        };

        var createdUser = await _repo.CreateUser(user);

        var accessToken = _jwt.GenerateAccessToken(user);

        var rt = await CreateAndSaveRefreshToken(createdUser.Id);

        return new AuthResponseDto(accessToken,rt);
        

    }

    public async Task<AuthResponseDto> Login(LoginDto dto)
    {
        var user = await _repo.FindByEmail(dto.Email) ?? throw new UnauthorizedException("Invalid credentials");
        var isValid = _hasher.Verify(dto.Password, user.PasswordHash);

        if(!isValid) throw new UnauthorizedException("Invalid credentials");

        var accessToken = _jwt.GenerateAccessToken(user);

        var rt = await CreateAndSaveRefreshToken(user.Id);

        return new AuthResponseDto(accessToken,rt);

    }

    public async Task<(string accessToken, string refreshToken)> Refresh(string rt)
    {
        var token = await _repo.GetRefreshToken(rt) ?? throw new UnauthorizedException("Invalid token");
        if(token.ExpiresAt < DateTime.UtcNow) throw new UnauthorizedException("Token expired");
        if(token.RevokedAt != null) throw new UnauthorizedException("Token revoked");

        await _repo.RevokeRefreshToken(token);

        var newAccessToken = _jwt.GenerateAccessToken(token.User);
        var newRefreshToken = await CreateAndSaveRefreshToken(token.User.Id);

        return (newAccessToken,newRefreshToken);
    }

    public async Task Logout(string rt)
    {
        var token = await _repo.GetRefreshToken(rt);
        if(token == null) return;
        await _repo.RevokeRefreshToken(token);

    }

    private async Task<string> CreateAndSaveRefreshToken(Guid userId)
    {
        var refreshToken = new RefreshToken
        {
            Token = _jwt.GenerateRefreshToken(),
            UserId = userId,
        };

        await _repo.SaveRefreshToken(refreshToken);

        return refreshToken.Token;
        
    }
}