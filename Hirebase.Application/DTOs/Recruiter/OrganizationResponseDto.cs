namespace Hirebase.Application.DTOs.Recruiter;

public record OrganizationResponseDto(
    Guid Id,
    string Name,
    string? WebsiteUrl,
    string? Location,
    DateTime CreatedAt,
    DateTime UpdatedAt
);