using Hirebase.Application.DTOs.Recruiter;
using Hirebase.Application.Interfaces.Recruiter;
using Hirebase.Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Hirebase.API.Controllers.Recruiter;

[ApiController]
[Route("api/recruiter/jobpostings")]
[Authorize]
public class JobPostingController : ControllerBase
{
    private readonly IJobPostingService _service;
    private readonly IRecruiterProfileService _recruiterService;

    public JobPostingController(
        IJobPostingService service,
        IRecruiterProfileService recruiterService)
    {
        _service = service;
        _recruiterService = recruiterService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateJobPostingDto dto)
    {
        var job = await _service.Create(dto);
        return Ok(job);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedException("User not found");

        var recruiter = await _recruiterService.GetRecruiterProfileByUserId(Guid.Parse(userId));
        var postings = await _service.GetByRecruiterProfileId(recruiter.Id);
        return Ok(postings);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var posting = await _service.GetById(id);
        return Ok(posting);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update([FromBody] UpdateJobPostingDto dto, Guid id)
    {
        var posting = await _service.Update(dto, id);
        return Ok(posting);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.Delete(id);
        return NoContent();
    }
}