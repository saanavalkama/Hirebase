
namespace Hirebase.Application.DTOs.Recruiter;

public record RecruiterProfileResponseDto(
    Guid Id,
    Guid UserId,
    string Name,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<OrganizationResponseDto>Organizations
);