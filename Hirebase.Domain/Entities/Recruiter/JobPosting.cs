using Hirebase.Domain.Enums;

namespace Hirebase.Domain.Entities.Recruiter;

public class JobPosting
{
    public Guid Id {get;set;} = Guid.NewGuid();

    public Guid OrganizationId {get;set;}

    public Organization Organization {get;set;} = null!;

    public string Title {get;set;} = string.Empty;

    public string Description {get;set;} = string.Empty;

    public SeniorityLevel? SeniorityLevel {get;set;}

    public int? SalaryMin {get;set;}

    public int? SalaryMax {get;set;}

    public string? Location {get;set;}

    public RemotePreference? RemotePreference {get;set;}

    public JobPostingStatus Status {get;set;}

    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;

    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public DateOnly? LastApplicationDay {get;set;}


}