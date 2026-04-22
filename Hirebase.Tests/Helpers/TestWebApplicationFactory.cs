using Hirebase.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace Hirebase.Tests.Helpers;

public class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
       builder.ConfigureAppConfiguration((context, config) =>
{
    config.Sources.Clear(); // ← clear all existing sources including appsettings
    config.AddInMemoryCollection(new Dictionary<string, string?>
    {
        ["ConnectionStrings:DefaultConnection"] = "DataSource=:memory:",
        ["JwtSettings:Secret"] = "test-secret-key-minimum-32-characters-long",
        ["JwtSettings:Issuer"] = "test-issuer",
        ["JwtSettings:Audience"] = "test-audience",
        ["AllowedOrigins"] = "http://localhost:5173",
        ["GitHub:ClientId"] = "test-client-id",
        ["GitHub:ClientSecret"] = "test-client-secret",
        ["GitHub:RedirectUri"] = "http://localhost:5000/api/github/callback"
    });
});

        builder.ConfigureServices(services =>
        {
            var descriptors = services.Where(d =>
                d.ServiceType.ToString().Contains("EntityFrameworkCore") ||
                d.ServiceType == typeof(DbContextOptions<AppDbContext>) ||
                d.ServiceType == typeof(AppDbContext)
            ).ToList();

            foreach (var descriptor in descriptors)
                services.Remove(descriptor);

            var dbName = Guid.NewGuid().ToString();

            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase(dbName));
        });

        builder.UseEnvironment("Test");
    }
}