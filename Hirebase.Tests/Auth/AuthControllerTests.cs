using System.Net;
using System.Net.Http.Json;
using System.Text;
using Hirebase.Application.DTOs.Auth;
using Hirebase.Infrastructure.Data;
using Hirebase.Tests.Helpers;
using Microsoft.Extensions.DependencyInjection;

namespace Hirebase.Tests.Auth;

public class AuthControllerTests : IClassFixture<TestWebApplicationFactory>, IAsyncLifetime
{
    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory _factory;

    public AuthControllerTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    public async Task InitializeAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    private static string? ExtractRefreshToken(HttpResponseMessage response)
    {
        if (!response.Headers.TryGetValues("Set-Cookie", out var cookies))
            return null;
        var cookie = cookies.FirstOrDefault(c => c.StartsWith("refreshToken="));
        return cookie?.Split(';')[0]["refreshToken=".Length..];
    }

    private Task<HttpResponseMessage> PostWithCookie(string url, string refreshToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = new StringContent("{}", Encoding.UTF8, "application/json")
        };
        request.Headers.Add("Cookie", $"refreshToken={refreshToken}");
        return _client.SendAsync(request);
    }

    private async Task<string> RegisterAndGetRefreshToken(string email, string password = "Password123")
    {
        var response = await _client.PostAsJsonAsync("/api/auth/register", new RegisterDto(email, password, "CANDIDATE"));
        return ExtractRefreshToken(response)!;
    }

    [Fact]
    public async Task Register_ValidData_Returns200()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/register", new RegisterDto("test@test.com", "Password123", "CANDIDATE"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.NotNull(body);
        Assert.True(body.ContainsKey("accessToken"));
        Assert.False(string.IsNullOrEmpty(body["accessToken"]));
    }

    [Fact]
    public async Task Duplicate_Register_Fails()
    {
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterDto("test@test.com", "Password123", "CANDIDATE"));
        var response  = await _client.PostAsJsonAsync("/api/auth/register", new RegisterDto("test@test.com", "Password123", "CANDIDATE"));
        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.Contains("Email already in use",body!["error"]);
    }

    [Fact]
    public async Task Login_With_Valid_Credentials_OK()
    {
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterDto("test@test.com", "Password123", "CANDIDATE"));
        var res = await _client.PostAsJsonAsync("/api/auth/login", new LoginDto("test@test.com", "Password123"));
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var body = await res.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.NotNull(body!["accessToken"]);

    }

    [Fact]
    public async Task Login_Returns_RT()
    {
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterDto("test@test.com", "Password123", "CANDIDATE"));
        var response = await _client.PostAsJsonAsync("/api/auth/login", new LoginDto("test@test.com", "Password123"));

        var rt = ExtractRefreshToken(response);
        Assert.NotNull(rt);
        Assert.False(string.IsNullOrEmpty(rt));
    }



    
}
