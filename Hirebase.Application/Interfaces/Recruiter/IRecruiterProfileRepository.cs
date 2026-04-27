using Hirebase.Domain.Entities.Recruiter;

namespace Hirebase.Application.Interfaces.Recruiter;

public interface IRecruiterProfileRepository
{
    Task<RecruiterProfile>Create(RecruiterProfile recruiter);
    Task<RecruiterProfile>Update(RecruiterProfile recruiter);

    Task<RecruiterProfile?>FindRecruiterByUserId(Guid userId);

    Task DeleteRecruiterProfile(Guid userId);
}