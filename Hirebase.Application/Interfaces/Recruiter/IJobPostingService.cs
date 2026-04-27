using Hirebase.Application.DTOs.Recruiter;

namespace Hirebase.Application.Interfaces.Recruiter;

public interface IJobPostingService
{
    Task<JobPostingResponseDto> Create(CreateJobPostingDto dto, Guid recruiterProfileId);
    Task<JobPostingResponseDto> Update(UpdateJobPostingDto dto, Guid id, Guid recruiterProfileId);
    Task Delete(Guid id, Guid recruiterProfileId);
    Task<JobPostingResponseDto> GetById(Guid id);
    Task<List<JobPostingResponseDto>> GetByRecruiterProfileId(Guid recruiterProfileId);
}