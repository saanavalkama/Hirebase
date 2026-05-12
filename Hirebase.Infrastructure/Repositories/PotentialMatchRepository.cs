using Hirebase.Application.Interfaces;
using Hirebase.Domain.Entities.Matching;
using Hirebase.Domain.Enums;
using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hirebase.Infrastructure.Repositories;

public class PotentialMatchRepository : IPotentialMatchRepository
{
    private readonly AppDbContext _context;

    public PotentialMatchRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task Upsert(Guid candidateProfileId, Guid jobPostingId, MatchTier tier)
    {
        var existing = await _context.PotentialMatches
            .FirstOrDefaultAsync(pm => 
                pm.CandidateProfileId == candidateProfileId && 
                pm.JobPostingId == jobPostingId);

        if (existing != null)
        {
            existing.Tier = tier;
            existing.CalculatedAt = DateTime.UtcNow;
        }
        else
        {
            _context.PotentialMatches.Add(new PotentialMatch
            {
                CandidateProfileId = candidateProfileId,
                JobPostingId = jobPostingId,
                Tier = tier,
                CalculatedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();
    }

    public async Task Delete(Guid candidateProfileId, Guid jobPostingId)
    {
        var match = await _context.PotentialMatches
            .FirstOrDefaultAsync(pm => 
                pm.CandidateProfileId == candidateProfileId && 
                pm.JobPostingId == jobPostingId);

        if (match != null)
        {
            _context.PotentialMatches.Remove(match);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<PotentialMatch>> GetByCandidate(Guid candidateProfileId)
    {
        return await _context.PotentialMatches
            .Where(pm => pm.CandidateProfileId == candidateProfileId)
            .ToListAsync();
    }
}