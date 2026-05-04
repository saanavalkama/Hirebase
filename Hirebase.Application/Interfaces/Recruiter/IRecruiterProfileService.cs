using Hirebase.Application.DTOs.Recruiter;

namespace Hirebase.Application.Interfaces.Recruiter;

public interface IRecruiterProfileService
{
    Task <RecruiterProfileResponseDto>Create(CreateRecruiterProfileDto dto, Guid userId);
    Task<RecruiterProfileResponseDto>GetRecruiterProfileByUserId(Guid userId);

    Task<RecruiterProfileResponseDto>Update(UpdateRecruiterProfileDto dto, Guid userId);

    Task Delete(Guid userId);
}