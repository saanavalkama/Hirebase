namespace Hirebase.Application.DTOs.CandidateProfile;

public record UpdateCandidateProfileDto(
    string? Name,
    string? Location,
    string? Bio,
    string? LinkedInUrl,
    string? PersonalSiteUrl,
    string? CvUrl,
    int? YearsOfExperience,
    int? SalaryMin,
    int? SalaryMax,
    DateOnly? AvailableFrom,
    List<string> SoftSkills,
    List<string> PreferredRoles,
    DateTime UpdatedAt,
    string? SeniorityLevel,
    string? RemotePreference
);