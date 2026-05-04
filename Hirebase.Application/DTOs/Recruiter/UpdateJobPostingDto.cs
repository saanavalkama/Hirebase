namespace Hirebase.Application.DTOs.Recruiter;
public record UpdateJobPostingDto(
    string? Title,
    string? Description,
    string? SeniorityLevel,
    int? SalaryMin,
    int? SalaryMax,
    string? Location,
    string? RemotePreference,
    string? Status,
    DateOnly? LastApplicationDay,
    List<string>? RequiredLanguages,
    string? PreferredRole,
    List<string>JobPostingSoftSkills 

);