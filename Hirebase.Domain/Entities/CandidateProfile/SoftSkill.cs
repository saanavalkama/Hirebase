using Hirebase.Domain.Enums;

namespace Hirebase.Domain.Entities.CandidateProfile;

public class SoftSkill
{
    public Guid Id {get;set;} = Guid.NewGuid();

    public Guid CandidateProfileId {get;set;}

    public CandidateProfile CandidateProfile {get;set;} = null!;

    public SoftSkillType Skill {get;set;}


}