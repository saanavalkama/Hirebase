using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Domain.Entities.Recruiter;
using Hirebase.Domain.Enums;

namespace Hirebase.Domain.Entities.Application;

public class CandidateApplication
{
    public Guid Id {get;set;} = Guid.NewGuid();

    public Guid CandidateProfileId {get;set;}

    public CandidateProfile CandidateProfile {get;set;} = null!;
    public Guid JobPostingId {get;set;}

    public JobPosting JobPosting {get;set;} = null!;
    public ApplicationStage ApplicationStage {get;set;} = ApplicationStage.Applied;
    public DateTime AppliedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
}