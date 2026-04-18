using Hirebase.Domain.Enums;
using Hirebase.Domain.Entities.CandidateProfiles;

namespace Hirebase.Domain.Entities.CandidateProfiles;

public class SoftSkill
{
    public Guid Id {get;set;} = Guid.NewGuid();

    public Guid CandidateProfileId {get;set;}

    public CandidateProfile CandidateProfile {get;set;} = null!;

    public SoftSkillType Skill {get;set;}


}