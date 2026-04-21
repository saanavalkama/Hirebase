using System.Security.Claims;
using Hirebase.Application.DTOs.CandidateProfile;
using Hirebase.Application.Interfaces;
using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hirebase.API.Controllers;

[ApiController]
[Route("api/candidate")]
[Authorize]
public class CandidateProfileController : ControllerBase
{
    private readonly ICandidateProfileService _service;

    public CandidateProfileController(ICandidateProfileService service)
    {
        _service = service;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
          ?? throw new UnauthorizedException("User not found");

        var profile = await _service.GetProfile(Guid.Parse(userId));
        return Ok(profile);
    }

    [HttpPatch("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateCandidateProfileDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedException("User not found");

        var profile = await _service.UpdateProfile(dto, Guid.Parse(userId));
        return Ok(profile);
    }

    
}