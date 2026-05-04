using Hirebase.Application.Interfaces.Recruiter;
using Hirebase.Domain.Entities.Recruiter;
using Hirebase.Domain.Exceptions;
using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hirebase.Infrastructure.Repositories.Recruiter;

public class JobPostingRepository : IJobPostingRepository
{
    private readonly AppDbContext _context;

    public JobPostingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<JobPosting> Create(JobPosting jobPosting)
    {
        _context.JobPostings.Add(jobPosting);
        await _context.SaveChangesAsync();
        return jobPosting;
    }

    public async Task<JobPosting> Update(JobPosting jobPosting)
    {
        _context.JobPostings.Update(jobPosting);
        await _context.SaveChangesAsync();
        return jobPosting;
    }

    public async Task Delete(Guid id)
    {
        var entity = await _context.JobPostings.FindAsync(id);
        if (entity == null) throw new NotFoundException("JobPosting");
        _context.JobPostings.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<JobPosting?> GetById(Guid id)
    {
        return await _context.JobPostings
            .Include(j => j.Organization)
            .FirstOrDefaultAsync(j => j.Id == id);
    }

    public async Task<List<JobPosting>> GetByOrganizationId(Guid organizationId)
    {
        return await _context.JobPostings
            .Where(j => j.OrganizationId == organizationId)
            .ToListAsync();
    }

    public async Task<List<JobPosting>> GetByRecruiterProfileId(Guid recruiterProfileId)
    {
        return await _context.JobPostings
            .Include(j => j.Organization)
            .Where(j => j.Organization.RecruiterProfileId == recruiterProfileId)
            .ToListAsync();
    }
}