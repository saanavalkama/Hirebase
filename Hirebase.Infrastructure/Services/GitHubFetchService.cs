using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Hirebase.Application.Interfaces;
using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Domain.Enums;
using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Hirebase.Domain.Exceptions;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace Hirebase.Infrastructure.Services;
public class GitHubFetchService : IGitHubFetchService
{
    private readonly AppDbContext _db;
    private readonly ITokenEncryptionService _encryption;

    private readonly HttpClient _http;

    private readonly ILogger<GitHubFetchService> _logger;
    public GitHubFetchService(
        AppDbContext db,
        ITokenEncryptionService encryption,
        HttpClient http,
        ILogger<GitHubFetchService> logger
    )
    {
        _db = db;
        _encryption = encryption;
        _http = http;
        _logger = logger;
    }

    public async Task FetchAndCalculateAsync(Guid gitHubProfileId, CancellationToken ct = default)
    {
        var profile = await _db.GitHubProfiles.FindAsync([gitHubProfileId],ct)
            ?? throw new NotFoundException("Profile was not found");

        try
        {
            profile.FetchStatus = FetchStatus.Processing;
            await _db.SaveChangesAsync();

            var token = _encryption.Decrypt(profile.AccessToken);

            var repos = await FetchRepos(token, profile.GitHubUsername, ct);
            await EnrichWithMaturityData(token, profile.GitHubUsername, repos, ct);
            var events = await FetchEvents(token, profile.GitHubUsername, ct);
            var externalPrs = await FetchExternalPrs(token, profile.GitHubUsername, ct);

            var raw = new
            {
                Repos = repos,
                Events = events,
                ExternalPrs = externalPrs,
                FetchedAt = DateTime.UtcNow
            };

            profile.RawDataJson = JsonSerializer.Serialize(raw);
            profile.LastFetchedAt = DateTime.UtcNow;

            var existingSignals = await _db.GitHubSignals
                .FirstOrDefaultAsync(s => s.GitHubProfileId == gitHubProfileId, ct);

            var isNew = existingSignals == null;
            var signals = existingSignals ?? new GitHubSignals { GitHubProfileId = gitHubProfileId };

            signals.ActivityScore = CalculateActivityScore(events);
            signals.RepoMaturityScore = CalculateRepoMaturityScore(repos);
            signals.PopularityScore = CalculatePopularityScore(repos);
            signals.TopLanguages = CalculateTopLanguages(repos);
            signals.ExternalPrCount = externalPrs.Count;
            signals.CalculatedAt = DateTime.UtcNow;

            if (isNew)
                _db.GitHubSignals.Add(signals);

            profile.FetchStatus = FetchStatus.Done;
            await _db.SaveChangesAsync(ct);

            _logger.LogInformation("Signals calculated");

        } catch(Exception ex)
        {
            profile.FetchStatus = FetchStatus.Failed;
            await _db.SaveChangesAsync();
            _logger.LogError(ex, "Failed to fetch GitHubData");
            throw;
        }
    }

    private async Task<List<RepoResponse>> FetchRepos(string token, string username, CancellationToken ct)
    {
        var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"https://api.github.com/users/{username}/repos?per_page=100&sort=updated"
        );
        AddHeaders(request,token);

        var response = await _http.SendAsync(request, ct);
        return await response.Content.ReadFromJsonAsync<List<RepoResponse>>(cancellationToken:ct) ?? [];

    }

   private async Task<List<EventResponse>> FetchEvents(string token, string username, CancellationToken ct)
    {
        // GitHub returns last 90 days of events, up to 300
        var request = new HttpRequestMessage(HttpMethod.Get,
            $"https://api.github.com/users/{username}/events?per_page=100");
        AddHeaders(request, token);

        var response = await _http.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<List<EventResponse>>(cancellationToken: ct) ?? [];
    }

    private async Task<List<PrResponse>> FetchExternalPrs(string token, string username, CancellationToken ct)
    {
        // Search for PRs authored by user that are merged, excluding their own repos
        var request = new HttpRequestMessage(HttpMethod.Get,
            $"https://api.github.com/search/issues?q=type:pr+author:{username}+is:merged+-user:{username}&per_page=100");
        AddHeaders(request, token);
        request.Headers.Add("X-GitHub-Api-Version", "2022-11-28");

        var response = await _http.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<SearchResponse>(cancellationToken: ct);
        return result?.Items ?? [];
    }

     private int CalculateActivityScore(List<EventResponse> events)
    {
        var cutoff = DateTime.UtcNow.AddMonths(-24);
        var recentEvents = events.Where(e => e.CreatedAt >= cutoff).ToList();

        // Count distinct weeks with activity
        var activeWeeks = recentEvents
            .Select(e => $"{e.CreatedAt.Year}-{System.Globalization.ISOWeek.GetWeekOfYear(e.CreatedAt)}")
            .Distinct()
            .Count();

        var baseScore = (int)((activeWeeks / 104.0) * 100);

        // Deduct for long gaps (>4 weeks)
        var orderedDates = recentEvents
            .Select(e => e.CreatedAt)
            .OrderBy(d => d)
            .ToList();

        var gapDeductions = 0;
        for (int i = 1; i < orderedDates.Count; i++)
        {
            var gap = (orderedDates[i] - orderedDates[i - 1]).TotalDays;
            if (gap > 28) gapDeductions += 5;
        }

        return Math.Clamp(baseScore - gapDeductions, 0, 100);
    }

private int CalculateRepoMaturityScore(List<RepoResponse> repos)
{
    var ownRepos = repos
        .Where(r => !r.Fork)
        .OrderByDescending(r => r.StargazersCount)
        .Take(10)
        .ToList();
        
    if (ownRepos.Count == 0) return 0;

    var points = ownRepos.Sum(r =>
        (r.HasReadme ? 1 : 0) +
        (r.HasTests ? 1 : 0) +
        (r.HasCi ? 1 : 0));

    return (int)((points / (double)(ownRepos.Count * 3)) * 100);
}

    private int CalculatePopularityScore(List<RepoResponse> repos)
    {
        var ownRepos = repos.Where(r => !r.Fork).ToList();
        if (ownRepos.Count == 0) return 0;

        var total = ownRepos.Sum(r => r.StargazersCount + r.ForksCount);
        if (total == 0) return 0;

        // Log scale, ceiling of 1000
        var score = Math.Log10(total + 1) / Math.Log10(1001) * 100;
        return (int)Math.Clamp(score, 0, 100);
    }

    private string CalculateTopLanguages(List<RepoResponse> repos)
    {
        var languages = repos
            .Where(r => !r.Fork && r.Language != null)
            .GroupBy(r => r.Language!)
            .OrderByDescending(g => g.Count())
            .Take(5)
            .Select(g => g.Key)
            .ToList();

        return JsonSerializer.Serialize(languages);
    }

    private async Task EnrichWithMaturityData(
    string token, 
    string owner, 
    List<RepoResponse> repos, 
    CancellationToken ct)
{
    var top10 = repos
        .Where(r => !r.Fork)
        .OrderByDescending(r => r.StargazersCount)
        .Take(10)
        .ToList();

    var tasks = top10.Select(repo => CheckRepoContents(token, owner, repo.Name, ct));
    var results = await Task.WhenAll(tasks);

    for (int i = 0; i < top10.Count; i++)
    {
        var originalIndex = repos.IndexOf(top10[i]);
        var enriched = top10[i] with
        {
            HasReadme = results[i].HasReadme,
            HasTests = results[i].HasTests,
            HasCi = results[i].HasCi
        };
        repos[originalIndex] = enriched; 
        
    }
}

private async Task<(bool HasReadme, bool HasTests, bool HasCi)> CheckRepoContents(
    string token,
    string owner,
    string repo,
    CancellationToken ct)
{
    try
    {
        var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"https://api.github.com/repos/{owner}/{repo}/contents");
        AddHeaders(request, token);

        var response = await _http.SendAsync(request, ct);
        if (!response.IsSuccessStatusCode) return (false, false, false);

        var contents = await response.Content
            .ReadFromJsonAsync<List<ContentResponse>>(cancellationToken: ct) ?? [];

        var names = contents.Select(c => c.Name.ToLower()).ToList();

        var hasReadme = names.Any(n => n.StartsWith("readme"));
        var hasTests = names.Any(n => 
            n is "tests" or "test" or "__tests__" or "spec" ||
            n.EndsWith(".test.cs") || n.EndsWith(".spec.ts"));
        var hasCi = names.Any(n => n == ".github");

        // If .github exists, check if workflows folder is inside it
        if (hasCi)
        {
            var workflowRequest = new HttpRequestMessage(
                HttpMethod.Get,
                $"https://api.github.com/repos/{owner}/{repo}/contents/.github");
            AddHeaders(workflowRequest, token);

            var workflowResponse = await _http.SendAsync(workflowRequest, ct);
            if (workflowResponse.IsSuccessStatusCode)
            {
                var workflowContents = await workflowResponse.Content
                    .ReadFromJsonAsync<List<ContentResponse>>(cancellationToken: ct) ?? [];
                hasCi = workflowContents.Any(c => c.Name.ToLower() == "workflows");
            }
        }

        return (hasReadme, hasTests, hasCi);
    }
    catch
    {
        // If a single repo fails don't blow up the whole fetch
        return (false, false, false);
    }
}




    private void AddHeaders(HttpRequestMessage request, string token)
    {
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        request.Headers.UserAgent.Add(new ProductInfoHeaderValue("Hirebase","1.0"));
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }
    private record RepoResponse(
        [property: JsonPropertyName("name")] string Name,
        [property: JsonPropertyName("fork")] bool Fork,
        [property: JsonPropertyName("language")] string? Language,
        [property: JsonPropertyName("stargazers_count")] int StargazersCount,
        [property: JsonPropertyName("forks_count")] int ForksCount

    )
     {
        public bool HasReadme { get; set; }
        public bool HasTests { get; set; }
        public bool HasCi { get; set; }
    };

    private record EventResponse(
        [property: JsonPropertyName("type")] string Type,
        [property: JsonPropertyName("created_at")] DateTime CreatedAt
    );

    private record PrResponse(
        [property: JsonPropertyName("id")] int Id,
        [property: JsonPropertyName("title")] string Title
    );

    private record SearchResponse(
        [property: JsonPropertyName("items")] List<PrResponse> Items
    );

    private record ContentResponse(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("type")] string Type
);
}