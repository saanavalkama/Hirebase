using System.Security.Claims;
using Hirebase.Application.Interfaces;
using Hirebase.Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Hirebase.API.Controllers;

[ApiController]
[Route("api/github")]
public class GitHubController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IGitHubOAuthService  _githubService;

    public GitHubController(IConfiguration config, IGitHubOAuthService githubService)
    {
        _config = config;
        _githubService = githubService;
    } 

    [HttpGet("connect")]
    [Authorize]
    public IActionResult Connect()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedException("User not found");
        var clientId = _config["GitHub:ClientId"];
        if(string.IsNullOrEmpty(clientId)) throw new InvalidOperationException("Github ClientID requires");
        var redirectUri = _config["GitHub:RedirectUri"];
        if(string.IsNullOrEmpty(redirectUri)) throw new InvalidOperationException("Github redirectUri requires");
        var url = $"https://github.com/login/oauth/authorize?client_id={clientId}&redirect_uri={Uri.EscapeDataString(redirectUri)}&scope=read:user,repo&state={userId}";
        return Ok(new { url });
    }
[HttpGet("callback")]
    public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string state)
    {
        if(string.IsNullOrEmpty(code)) throw new BadRequestError("No code provided");
        if(string.IsNullOrEmpty(state)) throw new BadRequestError("No state provided");

        if(!Guid.TryParse(state, out var userId))
            throw new BadRequestError("Invalid state parameter");

        await _githubService.HandleCallback(code, userId);
        return Redirect("http://localhost:5173/app/candidate/editProfile");
    }

}