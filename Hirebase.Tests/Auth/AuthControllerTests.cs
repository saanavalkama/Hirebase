using System.Net;
using System.Net.Http.Json;
using Hirebase.Application.DTOs.Auth;
using Hirebase.Tests.Helpers;

namespace Hirebase.Tests.Auth;

public class AuthControllerTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthControllerTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_ValidData_Returns200()
    {
        var dto = new RegisterDto("test@test.com", "password123", "CANDIDATE");

        var response = await _client.PostAsJsonAsync("/api/auth/register", dto);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.NotNull(body);
        Assert.True(body.ContainsKey("accessToken"));
        Assert.False(string.IsNullOrEmpty(body["accessToken"]));
    }

    [Fact]
    public async Task Register_DuplicateEmail_Returns409()
    {
        var dto = new RegisterDto("duplicate@test.com", "password123", "CANDIDATE");

        await _client.PostAsJsonAsync("/api/auth/register", dto);
        var response = await _client.PostAsJsonAsync("/api/auth/register", dto);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task Login_ValidCredentials_Returns200()
    {
        var registerDto = new RegisterDto("login@test.com", "password123", "CANDIDATE");
        await _client.PostAsJsonAsync("/api/auth/register", registerDto);

        var loginDto = new LoginDto("login@test.com", "password123");
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginDto);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.NotNull(body);
        Assert.True(body.ContainsKey("accessToken"));
    }

    [Fact]
    public async Task Login_InvalidPassword_Returns401()
    {
        var registerDto = new RegisterDto("wrong@test.com", "password123", "CANDIDATE");
        await _client.PostAsJsonAsync("/api/auth/register", registerDto);

        var loginDto = new LoginDto("wrong@test.com", "wrongpassword");
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginDto);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Logout_Returns204()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/logout", new { });
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task Register_InvalidEmail_Returns400()
    {
        var dto = new RegisterDto("notanemail", "password123", "CANDIDATE");
        var response = await _client.PostAsJsonAsync("/api/auth/register", dto);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}