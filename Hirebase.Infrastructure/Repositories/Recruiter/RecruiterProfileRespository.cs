using Hirebase.Application.Interfaces.Recruiter;
using Hirebase.Domain.Entities.Recruiter;
using Hirebase.Domain.Exceptions;
using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hirebase.Infrastructure.Repositories.Recruiter;

public class RecruiterProfileRepository : IRecruiterProfileRepository
{
    private readonly AppDbContext _context;

    public RecruiterProfileRepository(
        AppDbContext context
    )
    {
        _context = context;
    }

    public async Task<RecruiterProfile>Create(RecruiterProfile recruiter)
    {
        _context.RecruiterProfiles.Add(recruiter);
        await _context.SaveChangesAsync();
        return recruiter;
    }

    public async Task<RecruiterProfile>Update(RecruiterProfile recruiter)
    {
        _context.RecruiterProfiles.Update(recruiter);
        await _context.SaveChangesAsync();
        return recruiter;
    }

    public async Task<RecruiterProfile?>FindRecruiterByUserId(Guid userId)
    {
        return await _context.RecruiterProfiles.FirstOrDefaultAsync(r => r.UserId == userId);
    }

    public async Task DeleteRecruiterProfile(Guid userId)
    {
        var entity = await _context.RecruiterProfiles.FirstOrDefaultAsync(r => r.UserId == userId);
        if(entity == null) throw new NotFoundException("Recruiter Profile");
        _context.RecruiterProfiles.Remove(entity);
        await _context.SaveChangesAsync();
    }
}