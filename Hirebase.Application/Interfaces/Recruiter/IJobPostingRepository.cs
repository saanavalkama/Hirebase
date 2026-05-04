using Hirebase.Domain.Entities.Recruiter;

namespace Hirebase.Application.Interfaces.Recruiter;

public interface IJobPostingRepository
{
    Task<JobPosting> Create(JobPosting jobPosting);
    Task<JobPosting> Update(JobPosting jobPosting);
    Task Delete(Guid id);
    Task<JobPosting?> GetById(Guid id);
    Task<List<JobPosting>> GetByOrganizationId(Guid organizationId);
    Task<List<JobPosting>> GetByRecruiterProfileId(Guid recruiterProfileId);
}