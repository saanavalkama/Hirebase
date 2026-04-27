namespace Hirebase.Domain.Entities.Recruiter;

public class Organization
{
    public Guid Id {get;set;} = Guid.NewGuid();
    public string Name {get;set;} = string.Empty;

    public string? WebsiteUrl {get;set;}

    public string? Location {get;set;}

    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;

    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public Guid RecruiterProfileId {get;set;}

    public RecruiterProfile RecruiterProfile {get;set;} = null!;

    public ICollection<JobPosting> JobPostings {get;set;} = [];


}