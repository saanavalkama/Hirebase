using Hirebase.Domain.Entities.Matching;
using Hirebase.Domain.Enums;

namespace Hirebase.Application.Interfaces;

public interface IPotentialMatchRepository
{
    Task Upsert(Guid candidateProfileId, Guid jobPostingId, MatchTier tier);
    Task Delete(Guid candidateProfileId, Guid jobPostingId);
    Task<List<PotentialMatch>> GetByCandidate(Guid candidateProfileId);
}