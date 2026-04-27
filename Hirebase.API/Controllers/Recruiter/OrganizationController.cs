using Hirebase.Application.DTOs.Recruiter;
using Hirebase.Application.Interfaces.Recruiter;
using Hirebase.Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Hirebase.API.Controllers.Recruiter;

[ApiController]
[Route("api/recruiter/organizations")]
[Authorize]
public class OrganizationController : ControllerBase
{
    private readonly IOrganizationService _service;
    private readonly IRecruiterProfileService _recruiterService;

    public OrganizationController(
        IOrganizationService service,
        IRecruiterProfileService recruiterService)
    {
        _service = service;
        _recruiterService = recruiterService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrganizationDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedException("User not found");

        var recruiter = await _recruiterService.GetRecruiterProfileByUserId(Guid.Parse(userId));
        var org = await _service.Create(dto, recruiter.Id);
        return Ok(org);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedException("User not found");

        var recruiter = await _recruiterService.GetRecruiterProfileByUserId(Guid.Parse(userId));
        var orgs = await _service.GetAllByRecruiterId(recruiter.Id);
        return Ok(orgs);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update([FromBody] UpdateOrganizationDto dto, Guid id)
    {
        var org = await _service.Update(dto, id);
        return Ok(org);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.Delete(id);
        return NoContent();
    }
}