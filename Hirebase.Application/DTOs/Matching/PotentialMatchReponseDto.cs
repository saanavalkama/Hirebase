
namespace Hirebase.Application.DTOs.Matching;
public record PotentialMatchResponseDto(
    Guid JobPostingId,
    string Tier
);