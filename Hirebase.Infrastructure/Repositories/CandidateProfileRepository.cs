using Hirebase.Application.Interfaces;
using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hirebase.Infrastructure.Repositories;

public class CandidateProfileRepository : ICandidateProfileRepository
{
    private readonly AppDbContext _context;

    public CandidateProfileRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CandidateProfile> CreateProfile(CandidateProfile profile)
    {
        _context.CandidateProfiles.Add(profile);
        await _context.SaveChangesAsync();
        return profile;
    }

    public async Task<CandidateProfile?>GetProfileByUserId(Guid userId)
    {
        return await _context.CandidateProfiles
          .Include(p => p.SoftSkills)
          .Include(p => p.PreferredRoles)
          .FirstOrDefaultAsync(p => p.UserId == userId);
    }

    public async Task<CandidateProfile> UpdateProfile(CandidateProfile profile)
    {
        _context.CandidateProfiles.Update(profile);
        await _context.SaveChangesAsync();
        return profile; 
    }


}