// AuthResponseDto.cs
namespace Hirebase.Application.DTOs.Auth;

public record AuthResponseDto(string AccessToken, string RefreshToken);