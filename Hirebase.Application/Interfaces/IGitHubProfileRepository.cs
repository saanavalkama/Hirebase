using Hirebase.Domain.Entities.CandidateProfiles;

namespace Hirebase.Application.Interfaces;

public interface IGitHubProfileRepository
{
    Task<GitHubProfile?>GetByProfileId(Guid cpid);
    Task<GitHubProfile>Create(GitHubProfile ghp);
    Task<GitHubProfile>Update(GitHubProfile ghp);

}