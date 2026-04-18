using Hirebase.Domain.Enums;

namespace Hirebase.Domain.Entities.CandidateProfiles;

public class CandidatePreferredRole
{
    public Guid Id {get;set;} = Guid.NewGuid();

    public Guid CandidateProfileId {get;set;}

    public CandidateProfile CandidateProfile {get;set;} = null!;

    public PreferredRoleType Role {get;set;}
}