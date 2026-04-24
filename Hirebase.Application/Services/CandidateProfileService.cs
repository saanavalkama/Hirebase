using Hirebase.Application.DTOs.CandidateProfile;
using Hirebase.Application.Interfaces;
using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Domain.Enums;
using Hirebase.Domain.Exceptions;
using System.Text.Json;


namespace Hirebase.Application.Services;

public class CandidateProfileService : ICandidateProfileService
{
    private readonly ICandidateProfileRepository _repo; 

    public CandidateProfileService(ICandidateProfileRepository repo)
    {
        _repo = repo;
    }

    public async Task<CandidateProfileResponseDto> CreateProfile(Guid userId)
    {
    var profile = new CandidateProfile
    {
        UserId = userId,
    };

    var created = await _repo.CreateProfile(profile);

    return MapToDto(created);
    }

    

    public async Task<CandidateProfileResponseDto> UpdateProfile(UpdateCandidateProfileDto dto, Guid userId)
{
    var profile = await _repo.GetProfileByUserId(userId)
        ?? throw new NotFoundException("Profile not found");

    if(dto.Name != null) profile.Name = dto.Name;
    if(dto.Location != null) profile.Location = dto.Location;
    if(dto.Bio != null) profile.Bio = dto.Bio;
    if(dto.LinkedInUrl != null) profile.LinkedInUrl = dto.LinkedInUrl;
    if(dto.PersonalSiteUrl != null) profile.PersonalSiteUrl = dto.PersonalSiteUrl;
    if(dto.YearsOfExperience != null) profile.YearsOfExperience = dto.YearsOfExperience;
    if(dto.SalaryMin != null) profile.SalaryMin = dto.SalaryMin;
    if(dto.SalaryMax != null) profile.SalaryMax = dto.SalaryMax;
    if(dto.AvailableFrom != null) profile.AvailableFrom = dto.AvailableFrom;
    if(dto.SeniorityLevel != null) profile.SeniorityLevel = Enum.Parse<SeniorityLevel>(dto.SeniorityLevel);
    if(dto.RemotePreference != null) profile.RemotePreference = Enum.Parse<RemotePreference>(dto.RemotePreference);

    profile.UpdatedAt = DateTime.UtcNow;

    var updated = await _repo.UpdateProfile(profile, dto.SoftSkills, dto.PreferredRoles);
    return MapToDto(updated);
}

    public async Task<CandidateProfileResponseDto> GetProfile(Guid userid)
    {
        var profile = await _repo.GetProfileByUserId(userid)
            ?? throw new NotFoundException("profile not found");
        return MapToDto(profile);
    }

    private CandidateProfileResponseDto MapToDto(CandidateProfile profile) => new(
        profile.Id,
        profile.UserId,
        profile.Name,
        profile.Location,
        profile.Bio,
        profile.LinkedInUrl,
        profile.PersonalSiteUrl,
        profile.CvUrl,
        profile.YearsOfExperience,
        profile.SalaryMin,
        profile.SalaryMax,
        profile.AvailableFrom,
        profile.SoftSkills.Select(s => s.Skill.ToString()).ToList(),
        profile.PreferredRoles.Select(r => r.Role.ToString()).ToList(),
        profile.CreatedAt,
        profile.UpdatedAt,
        profile.SeniorityLevel?.ToString(),
        profile.RemotePreference?.ToString(),
        MapGitHubStatus(profile.GitHubProfile)
    );

    private GitHubStatusDto MapGitHubStatus(GitHubProfile? gitHub)
{
    if (gitHub == null)
        return new GitHubStatusDto(false, "NotConnected", null, null);

    var nextRefresh = gitHub.LastFetchedAt?.AddDays(7);

    var signals = gitHub.Signals == null ? null : new GitHubSignalsDto(
        gitHub.Signals.ActivityScore,
        gitHub.Signals.RepoMaturityScore,
        gitHub.Signals.PopularityScore,
        JsonSerializer.Deserialize<List<string>>(gitHub.Signals.TopLanguages) ?? [],
        gitHub.Signals.ExternalPrCount,
        gitHub.Signals.CalculatedAt
    );

    return new GitHubStatusDto(
        true,
        gitHub.FetchStatus.ToString(),
        nextRefresh,
        signals
    );
}

}