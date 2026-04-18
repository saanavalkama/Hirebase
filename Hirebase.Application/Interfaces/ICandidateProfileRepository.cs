using Hirebase.Domain.Entities.CandidateProfiles;

namespace Hirebase.Application.Interfaces;

public interface ICandidateProfileRepository
{
    Task <CandidateProfile> CreateProfile(CandidateProfile cp);
    Task <CandidateProfile>UpdateProfile(CandidateProfile cp);

    Task<CandidateProfile?>GetProfileByUserId(Guid userId);
}