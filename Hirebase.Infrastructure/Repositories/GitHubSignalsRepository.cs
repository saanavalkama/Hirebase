using Hirebase.Application.Interfaces;
using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hirebase.Infrastructure.Repositories;
public class GitHubSignalsRepository : IGitHubSignalsRepository
{
    private readonly AppDbContext _context;

    public GitHubSignalsRepository(
        AppDbContext context
    ){
        _context = context;
    }

    public async Task<GitHubSignals?>GetByProfileId(Guid ghpid)
    {
        return await _context.GitHubSignals.FirstOrDefaultAsync(s => s.GitHubProfileId == ghpid);
    }

    public async Task<GitHubSignals>Create(GitHubSignals signals)
    {
        _context.GitHubSignals.Add(signals);
        await _context.SaveChangesAsync();
        return signals;
    }

    public async Task<GitHubSignals>Update(GitHubSignals signals)
    {
        _context.GitHubSignals.Update(signals);
        await _context.SaveChangesAsync();
        return signals;
    }

}