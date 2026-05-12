using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Hirebase.Application.Interfaces.Application;
using System.Security.Claims;
using Hirebase.Domain.Exceptions;
using Hirebase.Application.DTOs.Application;

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

    [HttpGet("recruiter/{jobPostingId}/applied")]
    public async Task<IActionResult> GetAllApplied(Guid jobPostingId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var paginatedApplications = await _applicationService.GetAllAppliedByJobPostingIdPaginated(jobPostingId, GetAndParseUserID(), page, pageSize);
        return Ok(paginatedApplications);
    }

    [HttpGet("recruiter/{jobPostingId}/pipeline")]
    public async Task<IActionResult> GetPipeline(Guid jobPostingId)
    {
        var pipeline = await _applicationService.GetPipeline(jobPostingId, GetAndParseUserID());
        return Ok(pipeline);
    }

    [HttpPatch("{applicationId}/stage")]
    public async Task<IActionResult>UpdateApplication(Guid applicationId, [FromBody] UpdateStageDto dto)
    {
       var application = await _applicationService.UpdateApplication(applicationId, GetAndParseUserID(),dto) ;
       return Ok(application);
    }

    [HttpDelete("{jobPostingId:guid}")]
    public async Task<IActionResult>Withdrawn(Guid jobPostingId)
    {
        var result = await _applicationService.Withdraw(jobPostingId, GetAndParseUserID());

        if(result) return NoContent();
    
        return NotFound();
    }

}