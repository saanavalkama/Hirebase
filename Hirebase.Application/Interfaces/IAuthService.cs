using Hirebase.Application.DTOs.Auth;

namespace Hirebase.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> Register(RegisterDto dto);
    Task<AuthResponseDto> Login(LoginDto dto);
    Task<(string accessToken, string refreshToken)> Refresh(string refreshToken);
    Task Logout(string refreshToken);
}