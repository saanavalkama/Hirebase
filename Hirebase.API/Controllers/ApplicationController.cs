using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Hirebase.Application.Interfaces.Application;
using System.Security.Claims;
using Hirebase.Domain.Exceptions;

namespace Hirebase.API.Controllers;

[Authorize]
[ApiController]
[Route("api/application")]



public class ApplicationController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public ApplicationController(
        IApplicationService applicationService
    )
    {
        _applicationService = applicationService;
    }

    private Guid GetAndParseUserID(){
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
          ?? throw new UnauthorizedException("User not found");

        if (!Guid.TryParse(userId, out var id))
            throw new UnauthorizedException("Invalid user ID");

        return id;
    }

    [HttpPost("{jobPostingId:guid}")]
    public async Task<IActionResult>Apply(Guid jobPostingId)
    {
        var res = await _applicationService.Apply(GetAndParseUserID(), jobPostingId);

        return Ok(res);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyApplications()
    {
        var applications = await _applicationService.GetMyApplications(GetAndParseUserID());
        return Ok(applications);
    }

    [HttpGet("my/job-ids")]
    public async Task<IActionResult> GetAllJobIds()
    {
    
        var ids = await _applicationService.GetAllCandidateApplicationIds(GetAndParseUserID());

        return Ok(ids);
    }

}