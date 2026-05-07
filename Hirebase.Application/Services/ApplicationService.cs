using Hirebase.Application.DTOs.Application;
using Hirebase.Application.Interfaces;
using Hirebase.Application.Interfaces.Application;
using Hirebase.Domain.Entities.Application;
using Hirebase.Domain.Enums;
using Hirebase.Domain.Exceptions;

namespace Hirebase.Application.Services;
public class ApplicationService : IApplicationService
{
    private readonly IApplicationRepository _repo;
    private readonly ICandidateProfileRepository _candidateRepo;

    public ApplicationService(
        IApplicationRepository repo,
        ICandidateProfileRepository candidateRepo
    ){
        _repo = repo;
        _candidateRepo = candidateRepo;
    }

    public async Task<ApplicationResponseDto> Apply(Guid userId, Guid jobPostingId)
    {
        var profile = await _candidateRepo.GetProfileByUserId(userId)
            ?? throw new NotFoundException("Candidate profile");

        var existing = await _repo.GetByCandidateProfileAndJobId(profile.Id, jobPostingId);

        if(existing != null) throw new ConflictException("Candidate has already applied for the position");

        var application = new CandidateApplication
        {
            JobPostingId = jobPostingId,
            CandidateProfileId = profile.Id,
            ApplicationStage = ApplicationStage.Applied
        };

        var saved = await _repo.Create(application);

        return MapToDto(saved);
    }

    public async Task<List<Guid>>GetAllCandidateApplicationIds(Guid userId)
    {
         var profile = await _candidateRepo.GetProfileByUserId(userId)
            ?? throw new NotFoundException("Candidate profile");

        var ids = await _repo.GetAllCandidateJobIds(profile.Id);

        return ids;
    }

    public async Task<List<ApplicationResponseDto>>GetMyApplications(Guid userId)
    {
        var profile = await _candidateRepo.GetProfileByUserId(userId)
          ?? throw new NotFoundException("Candidate Profile");

        var applications = await _repo.GetAllCandidateApplications(profile.Id);

        return [..applications.Select(a => MapToDto(a))];
    }


    private ApplicationResponseDto MapToDto(CandidateApplication application)
    {
        return new(
        Id: application.Id,
        JobPostingId: application.JobPostingId,
        JobTitle: application.JobPosting.Title,
        OrganizationName: application.JobPosting.Organization.Name,
        RoleType: application.JobPosting.PreferredRole,
        SeniorityLevel: application.JobPosting.SeniorityLevel?.ToString(),
        RemotePreference: application.JobPosting.RemotePreference?.ToString(),
        CandidateProfileId: application.CandidateProfileId,
        CandidateName: application.CandidateProfile.Name,
        Stage: application.ApplicationStage.ToString(),
        AppliedAt: application.AppliedAt,
        UpdatedAt: application.UpdatedAt
    );
    }
}