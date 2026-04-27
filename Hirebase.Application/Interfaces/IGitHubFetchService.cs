using System.Runtime.CompilerServices;

namespace Hirebase.Application.Interfaces;

public interface IGitHubFetchService
{
    Task FetchAndCalculateAsync(Guid gitHubProfileId, CancellationToken ct = default);
    
}