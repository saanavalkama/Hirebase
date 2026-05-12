using System.Runtime.CompilerServices;
using System.Text.Json;
using Hirebase.Application.DTOs.Application;
using Hirebase.Application.DTOs.Common;
using Hirebase.Application.Interfaces;
using Hirebase.Application.Interfaces.Application;
using Hirebase.Application.Interfaces.Recruiter;
using Hirebase.Domain.Entities.Application;
using Hirebase.Domain.Enums;
using Hirebase.Domain.Exceptions;

namespace Hirebase.Application.Services;
public class ApplicationService : IApplicationService
{
    private readonly IApplicationRepository _repo;
    private readonly ICandidateProfileRepository _candidateRepo;

    private readonly IRecruiterProfileRepository _recruiterRepo;

    private readonly IJobPostingRepository _jobpostingRepo;

    public ApplicationService(
        IApplicationRepository repo,
        ICandidateProfileRepository candidateRepo,
        IRecruiterProfileRepository recruiterRepo,
        IJobPostingRepository jobpostingRepo
    ){
        _repo = repo;
        _candidateRepo = candidateRepo;
        _recruiterRepo = recruiterRepo;
        _jobpostingRepo = jobpostingRepo;
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

    public async Task<PaginatedResponse<RecruiterApplicationResponseDto>>GetAllAppliedByJobPostingIdPaginated(Guid jobPostingId, Guid userId, int page, int pageSize)
    {
        
        var profile = await _recruiterRepo.FindRecruiterByUserId(userId) 
            ?? throw new NotFoundException("Recruiter");

        var jobPosting = await _jobpostingRepo.GetById(jobPostingId) 
            ?? throw new NotFoundException("Job posting");

        if(jobPosting.Organization.RecruiterProfileId != profile.Id) throw new ForbiddenException("No access to get the inbox");

        var total = await _repo.CountApplied(jobPostingId);
        var applications = await _repo.GetAllAppliedForJobPostingPaginated(jobPostingId, page, pageSize);

        return new PaginatedResponse<RecruiterApplicationResponseDto>(
            Items: applications.Select(a => MapToRecruiterDto(a)).ToList(),
            Page: page,
            PageSize: pageSize,
            TotalCount: total,
            TotalPages: (int)(Math.Ceiling(total/(double)pageSize)),
            HasNextPage: page * pageSize < total,
            HasPreviousPage: page > 1
        );
    }

    public async Task<List<RecruiterApplicationResponseDto>> GetPipeline(Guid jobPostingId, Guid userId)
    {
        var profile = await _recruiterRepo.FindRecruiterByUserId(userId) 
            ?? throw new NotFoundException("Recruiter");

        var jobPosting = await _jobpostingRepo.GetById(jobPostingId) 
            ?? throw new NotFoundException("Job posting");

        if(jobPosting.Organization.RecruiterProfileId != profile.Id) throw new ForbiddenException("No access to get the pipeline");

        var applications = await _repo.GetPipelineApplications(jobPostingId);
        return applications.Select(MapToRecruiterDto).ToList();
    
    }

    public async Task<ApplicationResponseDto>UpdateApplication(Guid applicationId,Guid userId, UpdateStageDto dto)
    {
        var profile = await _recruiterRepo.FindRecruiterByUserId(userId)
          ?? throw new NotFoundException("Recruiter");

        var application = await _repo.GetByApplicationId(applicationId)
            ?? throw new NotFoundException("Application");

        if(application.JobPosting.Organization.RecruiterProfileId != profile.Id)
            throw new ForbiddenException("You don't own this job posting");

        if(!Enum.TryParse<ApplicationStage>(dto.Stage, out var stage))
            throw new BadRequestException("Invalid application satge");
        
        ValidateTransition(application.ApplicationStage, stage);

        application.ApplicationStage = stage;
        application.UpdatedAt = DateTime.UtcNow;

        var updatedAndSaved = await _repo.UpdateApplication(application);

        return MapToDto(updatedAndSaved);

    }

    public async Task<bool>Withdraw(Guid jobPostingId, Guid userId)
    {
        var profile = await _candidateRepo.GetProfileByUserId(userId) 
            ?? throw new NotFoundException("Candidate profile");

        var result = await  _repo.Withdraw(jobPostingId, profile.Id);

        return result;
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



    private RecruiterApplicationResponseDto MapToRecruiterDto(CandidateApplication application)
    {
        var profile = application.CandidateProfile;
        var signals = application.CandidateProfile.GitHubProfile?.Signals;

        return new RecruiterApplicationResponseDto(
            Id: application.Id,
            Stage: application.ApplicationStage.ToString(),
            AppliedAt: application.AppliedAt,
            UpdatedAt: application.UpdatedAt,
            CandidateProfileId: application.CandidateProfileId,
            CandidateName: profile.Name,
            Location: profile.Location,
            Bio: profile.Bio,
            SeniorityLevel: profile.SeniorityLevel?.ToString(),
            YearsOfExperience: profile.YearsOfExperience,
            CvUrl: profile.CvUrl,
            LinkedInUrl: profile.LinkedInUrl,
            PersonalSiteUrl: profile.PersonalSiteUrl,
            ActivityScore: signals?.ActivityScore ?? 0,
            RepoMaturityScore: signals?.RepoMaturityScore ?? 0,
            PopularityScore: signals?.PopularityScore ?? 0,
            TopLanguages: JsonSerializer.Deserialize<List<string>>(signals?.TopLanguages ?? "[]") ?? [],
            ExternalPrCount: signals?.ExternalPrCount ?? 0,
            HasConnected: profile.GitHubProfile != null,
            SoftSkills: profile.SoftSkills.Select(s => s.Skill.ToString()).ToList(),
            PreferredRoles:profile.PreferredRoles.Select(s => s.Role.ToString()).ToList()

        );
    }

    private static readonly Dictionary<ApplicationStage, List<ApplicationStage>> AllowedTransitions = new()
    {
        { ApplicationStage.Applied, [ApplicationStage.Screening, ApplicationStage.Rejected] },
        { ApplicationStage.Screening, [ApplicationStage.Interview, ApplicationStage.Rejected] },
        { ApplicationStage.Interview, [ApplicationStage.Offer, ApplicationStage.Rejected] },
        { ApplicationStage.Offer, [ApplicationStage.Rejected] },
    };

    private void ValidateTransition(ApplicationStage current, ApplicationStage next)
    {
        if (!AllowedTransitions.TryGetValue(current, out var allowed) || !allowed.Contains(next))
            throw new BadRequestException($"Cannot transition from {current} to {next}");
        
    }
}
