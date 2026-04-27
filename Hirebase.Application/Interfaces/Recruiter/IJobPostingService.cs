using Hirebase.Application.DTOs.Recruiter;

namespace Hirebase.Application.Interfaces.Recruiter;

public interface IJobPostingService
{
    Task<JobPostingResponseDto> Create(CreateJobPostingDto dto);
    Task<JobPostingResponseDto> Update(UpdateJobPostingDto dto, Guid id);
    Task Delete(Guid id);
    Task<JobPostingResponseDto> GetById(Guid id);
    Task<List<JobPostingResponseDto>> GetByRecruiterProfileId(Guid recruiterProfileId);
}