using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Hirebase.Application.Interfaces;
using System.Security.Claims;
using Hirebase.Domain.Exceptions;
using Hirebase.Application.DTOs.Application;

[Authorize]
[ApiController]
[Route("api/potential-match")]
public class PotentialMatchController : ControllerBase
{
    private readonly IPotentialMatchService _service;

    public PotentialMatchController(IPotentialMatchService service)
    {
        _service = service;
    }

    private Guid GetAndParseUserID()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedException("User not found");

        if (!Guid.TryParse(userId, out var id))
            throw new UnauthorizedException("Invalid user ID");

        return id;
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyMatches()
    {
        var matches = await _service.GetMyMatches(GetAndParseUserID());
        return Ok(matches);
    }
}