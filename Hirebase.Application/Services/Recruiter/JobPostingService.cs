// JobPostingService.cs
using System.Net.Http.Headers;
using System.Runtime.CompilerServices;
using System.Text.Json;
using Hirebase.Application.DTOs.Common;
using Hirebase.Application.DTOs.Recruiter;
using Hirebase.Application.Events;
using Hirebase.Application.Interfaces.Recruiter;
using Hirebase.Domain.Entities.Recruiter;
using Hirebase.Domain.Enums;
using Hirebase.Domain.Exceptions;
using MediatR;

namespace Hirebase.Application.Services.Recruiter;

public class JobPostingService : IJobPostingService
{
    private readonly IJobPostingRepository _repo;
    private readonly IOrganizationRepository _orgRepo;

    private readonly IMediator _mediator;

    public JobPostingService(
        IJobPostingRepository repo, 
        IOrganizationRepository orgRepo,
        IMediator mediator)
    {
        _repo = repo;
        _orgRepo = orgRepo;
        _mediator = mediator;
    }

    public async Task<JobPostingResponseDto> Create(CreateJobPostingDto dto, Guid recruiterProfileId)
    {
        var org = await _orgRepo.GetById(dto.OrganizationId)
            ?? throw new NotFoundException("Organization");

        if (org.RecruiterProfileId != recruiterProfileId)
            throw new ForbiddenException("You do not own this organization");

        var posting = new JobPosting
        {
            OrganizationId = dto.OrganizationId,
            Title = dto.Title,
            Description = dto.Description,
            SeniorityLevel = dto.SeniorityLevel != null
                ? Enum.Parse<SeniorityLevel>(dto.SeniorityLevel)
                : null,
            SalaryMin = dto.SalaryMin,
            SalaryMax = dto.SalaryMax,
            Location = dto.Location,
            RemotePreference = dto.RemotePreference != null
                ? Enum.Parse<RemotePreference>(dto.RemotePreference)
                : null,
            LastApplicationDay = dto.LastApplicationDay,
            Status = Enum.Parse<JobPostingStatus>(dto.Status),
            RequiredLanguages = JsonSerializer.Serialize(dto.RequiredLanguages),
            PreferredRole = dto.PreferredRole,
            JobPostingSoftSkills = JsonSerializer.Serialize(dto.JobPostingSoftSkills)
        };

        var saved = await _repo.Create(posting);
        await _mediator.Publish(new JobPostingCreatedEvent(saved.Id));
        return MapToDto(saved);
    }

    public async Task<JobPostingResponseDto> Update(UpdateJobPostingDto dto, Guid id, Guid recruiterProfileId)
    {
        var posting = await _repo.GetById(id)
            ?? throw new NotFoundException("JobPosting");

        if (posting.Organization.RecruiterProfileId != recruiterProfileId)
            throw new ForbiddenException("You do not own this job posting");

        if(dto.Title != null) posting.Title = dto.Title;
        if(dto.Description != null) posting.Description = dto.Description;
        if(dto.SeniorityLevel != null) posting.SeniorityLevel = Enum.Parse<SeniorityLevel>(dto.SeniorityLevel);
        if(dto.RemotePreference != null) posting.RemotePreference = Enum.Parse<RemotePreference>(dto.RemotePreference);
        if(dto.Status != null) posting.Status = Enum.Parse<JobPostingStatus>(dto.Status);
        if(dto.SalaryMin != null) posting.SalaryMin = dto.SalaryMin;
        if(dto.SalaryMax != null) posting.SalaryMax = dto.SalaryMax;
        if(dto.Location != null) posting.Location = dto.Location;
        if(dto.LastApplicationDay != null) posting.LastApplicationDay = dto.LastApplicationDay;
        if(dto.RequiredLanguages != null) posting.RequiredLanguages = JsonSerializer.Serialize(dto.RequiredLanguages);
        if(dto.PreferredRole != null) posting.PreferredRole = dto.PreferredRole;
        if(dto.JobPostingSoftSkills != null) posting.JobPostingSoftSkills = JsonSerializer.Serialize(dto.JobPostingSoftSkills);
        posting.UpdatedAt = DateTime.UtcNow;

        var updated = await _repo.Update(posting);
        await _mediator.Publish(new JobPostingUpdatedEvent(updated.Id));
        return MapToDto(updated);
    }

    public async Task Delete(Guid id, Guid recruiterProfileId)
    {
        var posting = await _repo.GetById(id)
            ?? throw new NotFoundException("JobPosting");

        if (posting.Organization.RecruiterProfileId != recruiterProfileId)
            throw new ForbiddenException("You do not own this job posting");

        await _repo.Delete(id);
    }

    public async Task<JobPostingResponseDto> GetById(Guid id)
    {
        var posting = await _repo.GetById(id)
            ?? throw new NotFoundException("JobPosting");
        return MapToDto(posting);
    }

    public async Task<List<JobPostingResponseDto>> GetByRecruiterProfileId(Guid recruiterProfileId)
    {
        var postings = await _repo.GetByRecruiterProfileId(recruiterProfileId);
        return postings.Select(MapToDto).ToList();
    }

   public async Task<PaginatedResponse<JobPostingResponseDto>>GetFeed(int page, int pageSize)
    {
        if(pageSize > 50 ) pageSize = 50;

        var total = await _repo.CountActive();
        var postings = await _repo.GetActivePaginated(page, pageSize);

        return new PaginatedResponse<JobPostingResponseDto>(
            Items: postings.Select(MapToDto).ToList(),
            Page: page,
            PageSize:pageSize,
            TotalCount: total,
            TotalPages: (int)Math.Ceiling(total / (double)(pageSize)),
            HasNextPage: page*pageSize < total,
            HasPreviousPage: page > 1
        );
    }

    private JobPostingResponseDto MapToDto(JobPosting posting) => new(
        posting.Id,
        posting.OrganizationId,
        posting.Organization.Name,
        posting.Title,
        posting.Description,
        posting.SeniorityLevel?.ToString(),
        posting.SalaryMin,
        posting.SalaryMax,
        posting.Location,
        posting.RemotePreference?.ToString(),
        posting.Status.ToString(),
        posting.LastApplicationDay,
        posting.CreatedAt,
        posting.UpdatedAt,
        JsonSerializer.Deserialize<List<string>>(posting.RequiredLanguages ?? "[]") ?? new List<string>(),
        posting.PreferredRole,
        JsonSerializer.Deserialize<List<string>>(posting.JobPostingSoftSkills ?? "[]") ?? new List<string>()
    );
}