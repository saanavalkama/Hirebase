namespace Hirebase.Domain.Entities.CandidateProfiles;

public class GitHubSignals
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GitHubProfileId { get; set; }
    public GitHubProfile GitHubProfile { get; set; } = null!;

    public int ActivityScore { get; set; }
    public int RepoMaturityScore { get; set; }
    public int PopularityScore { get; set; }
    public string TopLanguages { get; set; } = string.Empty; // JSON array
    public int ExternalPrCount { get; set; }

    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;
}