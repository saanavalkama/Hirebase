using Hirebase.Domain.Entities.Application;
using Hirebase.Infrastructure.Data;
using Hirebase.Application.Interfaces.Application;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using Hirebase.Domain.Entities.Recruiter;

namespace Hirebase.Infrastructure.Repositories;

public class ApplicationRepository: IApplicationRepository
{
    private readonly AppDbContext _context;

    public ApplicationRepository(
        AppDbContext context
    )
    {
        _context = context;
    }

    public async Task<CandidateApplication>Create(CandidateApplication application)
    {
        _context.CandidateApplications.Add(application);
        await _context.SaveChangesAsync();
        
        return await _context.CandidateApplications
            .Include(a => a.CandidateProfile)
            .Include(a => a.JobPosting)
            .ThenInclude(j => j.Organization)
            .FirstAsync(a => a.Id == application.Id);

    }

  public async Task <CandidateApplication?>GetByCandidateProfileAndJobId(Guid candidateProfileId, Guid jobPostingId)
    {
        return await _context.CandidateApplications
            .FirstOrDefaultAsync(a => a.CandidateProfileId == candidateProfileId && a.JobPostingId == jobPostingId);
    }

    public async Task <List<CandidateApplication>>GetAllCandidateApplications(Guid candidateProfileId)
    {
        return await _context.CandidateApplications
            .Where(a => a.CandidateProfileId == candidateProfileId)
            .Include(a => a.JobPosting).ThenInclude(j => j.Organization)
            .Include(a => a.CandidateProfile)
            .ToListAsync();
    }

      public async Task<List<Guid>>GetAllCandidateJobIds(Guid candidateProfileId)
    {
        return await _context.CandidateApplications
            .Where(a => a.CandidateProfileId == candidateProfileId)
            .Select(a => a.JobPostingId)
            .ToListAsync();
    }
   
}