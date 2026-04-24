using Hirebase.Application.Interfaces;
using Hirebase.Application.Settings;
using System.Net.Http.Headers;
using System.Text.Json;
using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Domain.Enums;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Hirebase.Domain.Exceptions;



namespace Hirebase.Application.Services;
public class GitHubOAuthService : IGitHubOAuthService
{
    private readonly GitHubSettings _settings;
    private readonly HttpClient _httpClient;

    private readonly ICandidateProfileRepository _candidateRepo;
    private readonly IGitHubProfileRepository _githubRepo;

    private readonly ITokenEncryptionService _tokenEncryptionService;

    public GitHubOAuthService(
        GitHubSettings settings, 
        HttpClient httpClient, 
        ICandidateProfileRepository candidateRepo, 
        IGitHubProfileRepository githubRepo,
        ITokenEncryptionService tokenEncryptionService
        )
    {
        _settings = settings;
        _httpClient = httpClient;
        _candidateRepo = candidateRepo;
        _githubRepo = githubRepo;
        _tokenEncryptionService = tokenEncryptionService;
    }

    public async Task HandleCallback(string code, Guid userId)
    {
        var token = await ExchangeCodeForToken(code) ?? throw new Exception("Failed to exchange code for token");

        var githubUser = await FetchGitHubUser(token);

        var profile = await _candidateRepo.GetProfileByUserId(userId) ?? throw new Exception("Candidate not found");

        var existing = await _githubRepo.GetByProfileId(profile.Id);

        if(existing != null)
        {
            existing.AccessToken = _tokenEncryptionService.Encrypt(token);
            existing.GitHubUsername = githubUser.Login;
            existing.GitHubId = githubUser.Id.ToString();
            existing.ProfileUrl = githubUser.HtmlUrl;
            existing.Followers = githubUser.Followers;
            existing.PublicRepos = githubUser.PublicRepos;
            existing.FetchStatus = FetchStatus.Pending;
            existing.LastFetchedAt = DateTime.UtcNow;
            await _githubRepo.Update(existing);
        }
        else
        {
            var githubProfile = new GitHubProfile
            {
                CandidateProfileId = profile.Id,
                AccessToken = _tokenEncryptionService.Encrypt(token),
                GitHubUsername = githubUser.Login,
                GitHubId = githubUser.Id.ToString(),
                ProfileUrl = githubUser.HtmlUrl,
                Followers = githubUser.Followers,
                PublicRepos = githubUser.PublicRepos,
                FetchStatus = FetchStatus.Pending
            };
            await _githubRepo.Create(githubProfile);
        }
    }

    private async Task<string?> ExchangeCodeForToken(string code)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "https://github.com/login/oauth/access_token");
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        request.Content = JsonContent.Create(new
        {
            client_id = _settings.ClientId,
            client_secret = _settings.ClientSecret,
            code,
            redirect_uri = _settings.RedirectUri
        });
         
        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        var token = json.GetProperty("access_token").GetString();

        return token;
    }

    private async Task<GitHubUserResponse> FetchGitHubUser(string token)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        request.Headers.UserAgent.Add(new ProductInfoHeaderValue("Hirebase", "1.0"));

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<GitHubUserResponse>()
            ?? throw new Exception("Failed to fetch GitHub user");

        
    }

    public async Task RefreshAsync(Guid userId)
{
    var profile = await _candidateRepo.GetProfileByUserId(userId)
        ?? throw new NotFoundException("Candidate not found");

    var github = await _githubRepo.GetByProfileId(profile.Id)
        ?? throw new NotFoundException("GitHub not connected");

    if (github.LastFetchedAt.HasValue && 
        github.LastFetchedAt.Value.AddDays(2) > DateTime.UtcNow)
    {
        throw new BadRequestError(
            $"Next refresh available at {github.LastFetchedAt.Value.AddDays(7):u}");
    }

    github.FetchStatus = FetchStatus.Pending;
    await _githubRepo.Update(github);
}

  public record GitHubUserResponse(
    [property: JsonPropertyName("login")] string Login,
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("html_url")] string HtmlUrl,
    [property: JsonPropertyName("followers")] int Followers,
    [property: JsonPropertyName("public_repos")] int PublicRepos
);

}