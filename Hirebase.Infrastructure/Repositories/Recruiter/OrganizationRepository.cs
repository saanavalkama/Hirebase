using Hirebase.Application.Interfaces.Recruiter;
using Hirebase.Domain.Entities.Recruiter;
using Hirebase.Domain.Exceptions;
using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hirebase.Infrastructure.Repositories.Recruiter;

public class OrganizationRepository : IOrganizationRepository
{
    private readonly AppDbContext _context;

    public OrganizationRepository(
        AppDbContext context
    )
    {
        _context = context;
    }

    public async Task<Organization>Create(Organization org)
    {
        _context.Organizations.Add(org);
        await _context.SaveChangesAsync();
        return org;
    }

    public async Task<Organization>Update(Organization org)
    {
        _context.Organizations.Update(org);
        await _context.SaveChangesAsync();
        return org;
    }

    public async Task Delete(Guid id)
    {
        var entity = await _context.Organizations.FindAsync(id);
        if(entity == null) throw new NotFoundException("Organization");
        _context.Organizations.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<Organization?>GetById(Guid id)
    {
        return await _context.Organizations.FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<List<Organization>>GetAllByRecruiterProfileId(Guid rid)
    {
        return await _context
            .Organizations
            .Where(o => o.RecruiterProfileId == rid)
            .ToListAsync();
    }

    


}