using Hirebase.Domain.Enums;
using Hirebase.Infrastructure.Data;
using Hirebase.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Hirebase.Infrastructure.Services;

public class GitHubFetchBackgroundJob : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<GitHubFetchBackgroundJob> _logger;
    private static readonly TimeSpan _interval = TimeSpan.FromSeconds(30);

    public GitHubFetchBackgroundJob(
        IServiceScopeFactory scopeFactory,
        ILogger<GitHubFetchBackgroundJob> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        _logger.LogInformation("GitHub fetch job started");

        while (!ct.IsCancellationRequested)
        {
            try
            {
                await ProcessPendingProfiles(ct);
            }
            catch (Exception ex)
            {
                // Don't let the whole job die if one cycle fails
                _logger.LogError(ex, "Error in fetch job cycle");
            }

            await Task.Delay(_interval, ct);
        }
    }

    private async Task ProcessPendingProfiles(CancellationToken ct)
    
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var fetchService = scope.ServiceProvider.GetRequiredService<IGitHubFetchService>();

        var pending = await db.GitHubProfiles
            .Where(g => g.FetchStatus == FetchStatus.Pending
                     || g.FetchStatus == FetchStatus.Failed
                     || (g.FetchStatus == FetchStatus.Processing && g.LastFetchedAt < DateTime.UtcNow.AddMinutes(-5))
                     || (g.FetchStatus == FetchStatus.Done && g.LastFetchedAt < DateTime.UtcNow.AddDays(-7)))
            .Select(g => g.Id)
            .ToListAsync(ct);

        if (pending.Count == 0) return;

        _logger.LogInformation("Processing {Count} pending GitHub profiles", pending.Count);

        foreach (var id in pending)
        {
            try
            {
                await fetchService.FetchAndCalculateAsync(id, ct);
                _logger.LogInformation("Successfully processed profile {Id}", id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed fetching profile {Id}", id);
            }
        }
    }
}