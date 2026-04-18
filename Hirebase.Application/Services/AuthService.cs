using Hirebase.Application.DTOs.Auth;
using Hirebase.Application.Interfaces;
using Hirebase.Domain.Entities.Auth;
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
        var existing = await _repo.FindByEmail(dto.Email.ToLower());
        if(existing != null) throw new ConflictException("Email already in use");

        if(!Enum.TryParse<UserRole>(dto.Role, ignoreCase:true, out var role))
        {
            throw new BadRequestError("Invalid role");
        }

        var user = new User
        {
            Email = dto.Email.ToLower(),
            PasswordHash = _hasher.Hash(dto.Password),
            Role = role
        };

        var createdUser = await _repo.CreateUser(user);

        var accessToken = _jwt.GenerateAccessToken(user);

        var rt = await CreateAndSaveRefreshToken(createdUser.Id,Guid.NewGuid());

        return new AuthResponseDto(accessToken,rt);
        

    }

    public async Task<AuthResponseDto> Login(LoginDto dto)
    {
        var user = await _repo.FindByEmail(dto.Email.ToLower()) ?? throw new UnauthorizedException("Invalid credentials");
        var isValid = _hasher.Verify(dto.Password, user.PasswordHash);

        if(!isValid) throw new UnauthorizedException("Invalid credentials");

        var accessToken = _jwt.GenerateAccessToken(user);

        var rt = await CreateAndSaveRefreshToken(user.Id, Guid.NewGuid());

        return new AuthResponseDto(accessToken,rt);

    }

    public async Task<(string accessToken, string refreshToken)> Refresh(string rt)
    {
        var token = await _repo.GetRefreshToken(rt) ?? throw new UnauthorizedException("Invalid token");
        if(token.RevokedAt != null)
        {
            await _repo.RevokeFamily(token.FamilyId);
            throw new UnauthorizedException("Token reuse detected");
        }
        if(token.ExpiresAt < DateTime.UtcNow) throw new UnauthorizedException("Token expired");

        await _repo.RevokeRefreshToken(token);

        var newAccessToken = _jwt.GenerateAccessToken(token.User);
        var newRefreshToken = await CreateAndSaveRefreshToken(token.User.Id,token.FamilyId);

        return (newAccessToken,newRefreshToken);
    }

    public async Task Logout(string rt)
    {
        var token = await _repo.GetRefreshToken(rt);
        if(token == null) return;
        await _repo.RevokeFamily(token.FamilyId);

    }

    public async Task LogoutAllDevices(string rt)
    {
        var token = await _repo.GetRefreshToken(rt);
        if(token == null) return;
        await _repo.RevokeAllByUserId(token.UserId);
    }

    private async Task<string> CreateAndSaveRefreshToken(Guid userId, Guid familyId)
    {
        var refreshToken = new RefreshToken
        {
            Token = _jwt.GenerateRefreshToken(),
            UserId = userId,
            FamilyId = familyId
        };

        await _repo.SaveRefreshToken(refreshToken);

        return refreshToken.Token;
        
    }
}