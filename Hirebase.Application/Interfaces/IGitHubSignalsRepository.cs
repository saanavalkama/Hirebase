using Hirebase.Domain.Entities.CandidateProfiles;

namespace Hirebase.Application.Interfaces;

public interface IGitHubSignalsRepository
{
    Task<GitHubSignals?> GetByProfileId(Guid gitHubProfileId);
    Task<GitHubSignals> Create(GitHubSignals signals);
    Task<GitHubSignals> Update(GitHubSignals signals);

    
}