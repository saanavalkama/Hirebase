using Hirebase.Application.DTOs.Matching;

namespace Hirebase.Application.Interfaces;

public interface IPotentialMatchService
{
    Task ScoreForCandidate(Guid candidateProfileId);
    Task ScoreForJob(Guid jobPostingId);

    Task<List<PotentialMatchResponseDto>> GetMyMatches(Guid userId);
}