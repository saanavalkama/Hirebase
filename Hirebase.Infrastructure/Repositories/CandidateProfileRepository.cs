using Hirebase.Application.Interfaces;
using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Domain.Enums;

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

    public async Task RemoveExistingSoftSkills(Guid profileId)
    {
        var existing = _context.SoftSkills.Where(s => s.CandidateProfileId == profileId);
        _context.SoftSkills.RemoveRange(existing);
    }

    public async Task RemoveExistingRoles(Guid profileId)
    {
        var existing = _context.PreferredRoles.Where(r => r.CandidateProfileId == profileId);
        _context.PreferredRoles.RemoveRange(existing);
    }

}