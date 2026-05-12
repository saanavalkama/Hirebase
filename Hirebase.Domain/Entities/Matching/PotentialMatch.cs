using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Domain.Entities.Recruiter;
using Hirebase.Domain.Enums;

namespace Hirebase.Domain.Entities.Matching;

public class PotentialMatch
{
    public Guid Id {get;set;}= Guid.NewGuid();
    public Guid CandidateProfileId {get;set;}

    public CandidateProfile CandidateProfile {get;set;} = null!;

    public Guid JobPostingId {get;set;}

    public JobPosting JobPosting {get;set;} = null!;

    public MatchTier Tier {get;set;}

    public DateTime CalculatedAt {get;set;} = DateTime.UtcNow;

}