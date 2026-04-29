namespace Hirebase.Application.DTOs.Recruiter;
public record CreateJobPostingDto(
    Guid OrganizationId,
    string Title,
    string Description,
    string? SeniorityLevel,
    int? SalaryMin,
    int? SalaryMax,
    string? Location,
    string? RemotePreference,
    DateOnly? LastApplicationDay,
    string Status
);