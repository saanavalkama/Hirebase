
namespace Hirebase.Application.DTOs.Recruiter;
public record JobPostingResponseDto(
    Guid Id,
    Guid OrganizationId,
    string OrganizationName,
    string Title,
    string Description,
    string? SeniorityLevel,
    int? SalaryMin,
    int? SalaryMax,
    string? Location,
    string? RemotePreference,
    string Status,
    DateOnly? LastApplicationDay,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<string> RequiredLanguages,
    string? PreferredRole,
    List<string> JobPostingSoftSkills
);