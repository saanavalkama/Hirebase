using Hirebase.Domain.Entities.Application;
using Hirebase.Infrastructure.Data;
using Hirebase.Application.Interfaces.Application;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using Hirebase.Domain.Entities.Recruiter;
using Hirebase.Domain.Enums;
using System.Data.Common;
using System.Drawing;
using Hirebase.Domain.Exceptions;

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

    public async Task<List<CandidateApplication>>GetAllAppliedForJobPostingPaginated(Guid jobPostingId, int page, int pageSize)
    {
        return await _context.CandidateApplications
            .Where(a => a.JobPostingId == jobPostingId && a.ApplicationStage == ApplicationStage.Applied)
            .OrderByDescending(a => a.AppliedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(a => a.CandidateProfile).ThenInclude(c => c.GitHubProfile).ThenInclude(g => g.Signals)
            .Include(a => a.CandidateProfile).ThenInclude(c => c.SoftSkills)
            .Include(a => a.CandidateProfile).ThenInclude(c => c.PreferredRoles)
            .ToListAsync();
    }

    public async Task<int>CountApplied(Guid jobPostingId)
    {
        return await _context.CandidateApplications
            .Where(a => a.JobPostingId == jobPostingId && a.ApplicationStage == ApplicationStage.Applied)
            .CountAsync();
    }

    public async Task<List<CandidateApplication>> GetPipelineApplications(Guid jobPostingId)
    {
        return await _context.CandidateApplications
            .Where(a =>
                a.JobPostingId == jobPostingId
                && a.ApplicationStage != ApplicationStage.Applied
                && a.ApplicationStage != ApplicationStage.Rejected
            )
            .Include(a => a.CandidateProfile).ThenInclude(c => c.GitHubProfile).ThenInclude(g => g.Signals)
            .Include(a => a.CandidateProfile).ThenInclude(c => c.SoftSkills)
            .Include(a => a.CandidateProfile).ThenInclude(c => c.PreferredRoles)
            .OrderBy(a => a.UpdatedAt)
            .ToListAsync();     
    }

    public async Task<CandidateApplication>UpdateApplication(CandidateApplication application)
    {
         _context.CandidateApplications.Update(application);
        await _context.SaveChangesAsync();
        return await _context.CandidateApplications
            .Include(a => a.CandidateProfile).ThenInclude(c => c.GitHubProfile).ThenInclude(g => g!.Signals)
            .Include(a => a.CandidateProfile).ThenInclude(c => c.SoftSkills)
            .Include(a => a.CandidateProfile).ThenInclude(c => c.PreferredRoles)
            .FirstAsync(a => a.Id == application.Id);

    }

    public async Task<CandidateApplication?>GetByApplicationId(Guid id)
    {
        return await _context.CandidateApplications
        .Include(a => a.JobPosting).ThenInclude(j => j.Organization)
        .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<bool> Withdraw(Guid jobId, Guid candidateId)
    {
        var entity = await _context.CandidateApplications
            .FirstOrDefaultAsync(a => a.JobPostingId == jobId && a.CandidateProfileId == candidateId);

        if(entity == null) throw new NotFoundException("Candidate application");

        _context.CandidateApplications.Remove(entity);

        await _context.SaveChangesAsync();

        return true;
    }
   
}