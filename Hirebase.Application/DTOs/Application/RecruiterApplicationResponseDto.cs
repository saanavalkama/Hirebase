public record RecruiterApplicationResponseDto(
    // application fields
    Guid Id,
    string Stage,
    DateTime AppliedAt,
    DateTime UpdatedAt,

    // candidate identity
    Guid CandidateProfileId,
    string? CandidateName,
    string? Location,
    string? Bio,
    string? SeniorityLevel,
    int? YearsOfExperience,

    // links
    string? CvUrl,
    string? LinkedInUrl,
    string? PersonalSiteUrl,

    // github
    int ActivityScore,
    int RepoMaturityScore,
    int PopularityScore,
    List<string> TopLanguages,
    int ExternalPrCount,
    bool HasConnected,

    // preferences
    List<string> SoftSkills,
    List<string> PreferredRoles
);