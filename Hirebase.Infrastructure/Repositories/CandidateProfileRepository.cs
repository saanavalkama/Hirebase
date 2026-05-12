using Hirebase.Application.Interfaces;
using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Hirebase.Domain.Enums;
using Hirebase.Domain.Exceptions;

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
          .Include(p => p.GitHubProfile).ThenInclude(p => p.Signals)
          .FirstOrDefaultAsync(p => p.UserId == userId);
    }

  public async Task<CandidateProfile> UpdateProfile(CandidateProfile profile, List<string>? softSkills, List<string>? preferredRoles)
{
    if(softSkills != null)
    {
        foreach(var skill in profile.SoftSkills.ToList())
            _context.Entry(skill).State = EntityState.Deleted;

        foreach(var skill in softSkills)
            _context.SoftSkills.Add(new SoftSkill
            {
                Skill = Enum.Parse<SoftSkillType>(skill),
                CandidateProfileId = profile.Id
            });
    }

    if(preferredRoles != null)
    {
        foreach(var role in profile.PreferredRoles.ToList())
            _context.Entry(role).State = EntityState.Deleted;

        foreach(var role in preferredRoles)
            _context.PreferredRoles.Add(new CandidatePreferredRole
            {
                Role = Enum.Parse<PreferredRoleType>(role),
                CandidateProfileId = profile.Id
            });
    }

    await _context.SaveChangesAsync();

    await _context.Entry(profile).Collection(p => p.SoftSkills).LoadAsync();
    await _context.Entry(profile).Collection(p => p.PreferredRoles).LoadAsync();

    return profile;
}

public async Task<List<CandidateProfile>> GetAllProfiles()
    {
        var profiles = await _context.CandidateProfiles
        .Include(c => c.SoftSkills)
        .Include(c => c.PreferredRoles)
        .Include(c => c.GitHubProfile).ThenInclude(g => g.Signals)
        .Where(c => c.SeniorityLevel != null)
        .ToListAsync();
        return profiles;

    }

public async Task<CandidateProfile?> GetProfileById(Guid candidateProfileId)
    {
        return await _context.CandidateProfiles
        .Include(c => c.SoftSkills)
        .Include(c => c.PreferredRoles)
        .Include(c => c.GitHubProfile).ThenInclude(g => g.Signals)
        .FirstOrDefaultAsync(c => c.Id == candidateProfileId);
    }


}