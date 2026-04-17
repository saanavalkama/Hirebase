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

       builder.ConfigureAppConfiguration(config =>
        {
        config.AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["ConnectionStrings:DefaultConnection"] = "DataSource=:memory:",
            ["JwtSettings:Secret"] = "test-secret-key-minimum-32-characters-long",
            ["AllowedOrigins"] = "http://localhost:5173"
        });
    });


        builder.ConfigureServices(services =>
        {
            // remove all EF Core related services
            var descriptors = services.Where(d =>
            d.ServiceType.ToString().Contains("EntityFrameworkCore") ||
            d.ServiceType == typeof(DbContextOptions<AppDbContext>) ||
            d.ServiceType == typeof(AppDbContext)
            ).ToList();

        foreach (var descriptor in descriptors)
            services.Remove(descriptor);

        var dbName = Guid.NewGuid().ToString();

        // replace with in-memory
        services.AddDbContext<AppDbContext>(options =>
            options.UseInMemoryDatabase(dbName));
        });

        builder.UseEnvironment("Test");
    }
}