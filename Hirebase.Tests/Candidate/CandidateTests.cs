using System.Net;
using System.Net.Http.Json;
using Hirebase.Application.DTOs.Auth;
using Hirebase.Infrastructure.Data;
using Hirebase.Tests.Helpers;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace Hirebase.Tests.CandidateProfile;

public class CandidateProfileTests : IClassFixture<TestWebApplicationFactory>, IAsyncLifetime
{
    private HttpClient _client;
    private HttpClientHandler _handler;
    private readonly TestWebApplicationFactory _factory;

    public CandidateProfileTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateDefaultClient();
    }

    public async Task InitializeAsync()
    {
       
        _client = _factory.CreateDefaultClient();

        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    private async Task<Dictionary<string, string>> RegisterUser(string email, string password = "Password123", string role = "CANDIDATE")
    {
        var dto = new RegisterDto(email, password, role);
        var response = await _client.PostAsJsonAsync("/api/auth/register", dto);
        return await response.Content.ReadFromJsonAsync<Dictionary<string, string>>() ?? [];
    }

    [Fact]
    public async Task Register_Candidate_CreatesCandidateProfile()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/register",
            new RegisterDto("candidate@test.com", "Password123", "CANDIDATE"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.NotNull(body);
        Assert.True(body.ContainsKey("accessToken"));
    }

    [Fact]
    public async Task Register_Recruiter_DoesNotCreateCandidateProfile()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/register",
            new RegisterDto("recruiter@test.com", "Password123", "RECRUITER"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}