using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Domain.Enums;

public class GitHubProfile
{
    public Guid Id {get;set;} = Guid.NewGuid();
    public Guid CandidateProfileId {get;set;}

    public CandidateProfile CandidateProfile {get;set;} = null!;

    public string GitHubUsername { get; set; } = string.Empty;
    public string GitHubId { get; set; } = string.Empty;
    public string AccessToken { get; set; } = string.Empty; // encrypted
    public string ProfileUrl { get; set; } = string.Empty;
    public int Followers { get; set; }
    public int PublicRepos { get; set; }

    public FetchStatus FetchStatus { get; set; } = FetchStatus.Pending;
    public DateTime? LastFetchedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}