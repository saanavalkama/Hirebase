using Hirebase.Application.DTOs.Recruiter;
using Hirebase.Application.Interfaces.Recruiter;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Hirebase.Domain.Exceptions;

namespace Hirebase.API.Controllers.Recruiter;

[ApiController]
[Route("api/recruiter")]
[Authorize]

public class RecruiterProfileController : ControllerBase
{
    private readonly IRecruiterProfileService _service;

    public RecruiterProfileController(
        IRecruiterProfileService service
    )
    {
        _service = service;
    }

    [HttpPost("profile")]

    public async Task <IActionResult>CreateRecruiterProfile([FromBody] CreateRecruiterProfileDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedException("User not found");

        var profile = await _service.Create(dto,Guid.Parse(userId));
        return Ok(profile);
    }

    [HttpPatch("profile")]
    public async Task<IActionResult>Update([FromBody]UpdateRecruiterProfileDto dto)
    {     
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedException("User not found");
        
        var profile = await _service.Update(dto, Guid.Parse(userId));

        return Ok(profile);
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetRecruiterById()
    {
       
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedException("User not found");

        var profile = await _service.GetRecruiterProfileByUserId(Guid.Parse(userId));
        return Ok(profile);
    }

    [HttpDelete("profile")]
    public async Task<IActionResult> Delete()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedException("User not found");

        await _service.Delete(Guid.Parse(userId));

        return NoContent();
    }

}