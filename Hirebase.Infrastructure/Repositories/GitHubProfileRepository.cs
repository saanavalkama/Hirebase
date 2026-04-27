using Hirebase.Application.Interfaces;
using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Hirebase.Domain.Entities.CandidateProfiles;

namespace Hirebase.Infrastructure.Repositories;

public class GitHubProfileRepository :IGitHubProfileRepository
{
    private readonly AppDbContext _context;

    public GitHubProfileRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GitHubProfile?>GetByProfileId(Guid cpid)
    {
        return await _context.GitHubProfiles.FirstOrDefaultAsync(g => g.CandidateProfileId == cpid);
    }

    public async Task<GitHubProfile>Create(GitHubProfile ghp)
    {
        _context.GitHubProfiles.Add(ghp);
        await _context.SaveChangesAsync();
        return ghp;
    }

    public async Task<GitHubProfile>Update(GitHubProfile ghp)
    {
        _context.GitHubProfiles.Update(ghp);
        await _context.SaveChangesAsync();
        return ghp; 
    }
}