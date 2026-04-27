namespace Hirebase.Application.DTOs.CandidateProfile;

public record GitHubSignalsDto(
    int ActivityScore,
    int RepoMaturityScore,
    int PopularityScore,
    List<string> TopLanguages,
    int ExternalPrCount,
    DateTime CalculatedAt
);

public record GitHubStatusDto(
    bool HasConnected,
    string FetchStatus,
    DateTime? NextRefreshAvailable,
    GitHubSignalsDto? Signals
);