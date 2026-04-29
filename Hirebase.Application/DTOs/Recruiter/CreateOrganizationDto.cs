namespace Hirebase.Application.DTOs.Recruiter;

public record CreateOrganizationDto(
    string Name,
    string? WebsiteUrl,
    string? Location
);