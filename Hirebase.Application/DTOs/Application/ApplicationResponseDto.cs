namespace Hirebase.Application.DTOs.Application;

public record ApplicationResponseDto(
    Guid Id,
    Guid JobPostingId,
    string JobTitle,
    string OrganizationName,
    string? RoleType,
    string? SeniorityLevel,
    string? RemotePreference,
    Guid CandidateProfileId,
    string? CandidateName,
    string Stage,
    DateTime AppliedAt,
    DateTime UpdatedAt
);