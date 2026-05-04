using Hirebase.Domain.Entities.Auth;

namespace Hirebase.Domain.Entities.Recruiter;

public class RecruiterProfile
{
    public Guid Id {get;set;} = Guid.NewGuid();

    public string Name {get;set;} = string.Empty;

    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;

    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public Guid UserId {get;set;}

    public User User {get;set;} = null!;

    public ICollection<Organization> Organizations {get;set;} = [];


}