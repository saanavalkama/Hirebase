using System.Security.Claims;
using Hirebase.Application.Interfaces;
using Hirebase.Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
namespace Hirebase.API.Controllers;

[ApiController]
[Route("api/github")]
public class GitHubController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IGitHubOAuthService  _githubService;

    private readonly IMemoryCache _cache;

    public GitHubController(
        IConfiguration config, 
        IGitHubOAuthService githubService,
        IMemoryCache cache
        )
    {
        _config = config;
        _githubService = githubService;
        _cache = cache;
    } 
// On connect - store a random state tied to userId
[HttpGet("connect")]
[Authorize]
public IActionResult Connect()
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) 
        ?? throw new UnauthorizedException("User not found");

    var clientId = _config["GitHub:ClientId"];
    if(string.IsNullOrEmpty(clientId)) throw new InvalidOperationException("Github ClientID required");
    var redirectUri = _config["GitHub:RedirectUri"];
    if(string.IsNullOrEmpty(redirectUri)) throw new InvalidOperationException("Github redirectUri required");
    
    var state = Guid.NewGuid().ToString(); 
    
    
    _cache.Set($"oauth_state:{state}", userId, TimeSpan.FromMinutes(5));
    
    var url = $"https://github.com/login/oauth/authorize?client_id={clientId}&redirect_uri={Uri.EscapeDataString(redirectUri)}&scope=read:user,public_repo&state={state}";
    return Ok(new { url });
}


[HttpGet("callback")]
public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string state)
{
    if(string.IsNullOrEmpty(code)) throw new BadRequestException("No code provided");
if(string.IsNullOrEmpty(state)) throw new BadRequestException("No state provided");

    if (!_cache.TryGetValue($"oauth_state:{state}", out string? userId))
        throw new BadRequestException("Invalid or expired state parameter");

    var frontendUri = _config["GitHub:FrontendUri"];
    if(string.IsNullOrEmpty(frontendUri)) throw new InvalidOperationException("frontend uri required");
    _cache.Remove($"oauth_state:{state}");

    await _githubService.HandleCallback(code, Guid.Parse(userId!));
    return Redirect(frontendUri);
}

}