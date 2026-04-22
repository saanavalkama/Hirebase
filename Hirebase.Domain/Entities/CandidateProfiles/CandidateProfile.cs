using Hirebase.Domain.Entities.Auth;
using Hirebase.Domain.Enums;

namespace Hirebase.Domain.Entities.CandidateProfiles;

public class CandidateProfile
{
    public Guid Id {get;set;} = Guid.NewGuid();

    public Guid UserId {get;set;}

    public User User {get;set;} = null!;

    public string? Name {get;set;}

    public string? Location {get;set;}

    public string? Bio {get;set;}
    public string? LinkedInUrl { get; set; }
    public string? PersonalSiteUrl { get; set; }
    public string? CvUrl { get; set; }
    public int? YearsOfExperience { get; set; }
    //Salary Values are in EUR    
    public int? SalaryMin { get; set; }
    public int? SalaryMax { get; set; }
    public DateOnly? AvailableFrom { get; set; }
    public RemotePreference? RemotePreference { get; set; }
    public SeniorityLevel? SeniorityLevel { get; set; }

    public ICollection<SoftSkill> SoftSkills { get; set; } = [];
    public ICollection<CandidatePreferredRole> PreferredRoles { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public GitHubProfile? GitHubProfile {get;set;}
}




