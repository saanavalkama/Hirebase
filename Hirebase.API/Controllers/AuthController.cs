using Hirebase.Application.DTOs.Auth;
using Hirebase.Application.Interfaces;
using Hirebase.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


namespace Hirebase.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    
    public AuthController(IAuthService authService)
    {
       _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var result = await _authService.Register(dto);
        SetRefreshTokenCookie(result.RefreshToken);
        return Ok(new {accessToken = result.AccessToken});

    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.Login(dto);
        SetRefreshTokenCookie(result.RefreshToken);
        return Ok(new {accessToken = result.AccessToken});
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var rt = Request.Cookies["refreshToken"] ?? throw new UnauthorizedException("No refresh token");

        var (accessToken, refreshToken) = await _authService.Refresh(rt);
        SetRefreshTokenCookie(refreshToken);
        return Ok(new{accessToken});

    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var rt = Request.Cookies["refreshToken"];
        if (rt != null) await _authService.Logout(rt);
        Response.Cookies.Delete("refreshToken");
        return NoContent();
    }

    [HttpPost("logout-all")]
    public async Task<IActionResult> LogoutAllDevices()
    {
        var rt = Request.Cookies["refreshToken"];
        if (rt != null) await _authService.LogoutAllDevices(rt);
        Response.Cookies.Delete("refreshToken");
        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(ClaimTypes.Email);
        var role = User.FindFirstValue(ClaimTypes.Role);

        return Ok(new { userId, email, role });
    }

    // TODO: set Secure = true and SameSite = Strict in production
    private void SetRefreshTokenCookie(string rt)
    {
        Response.Cookies.Append("refreshToken", rt, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7)
        });
    }


}