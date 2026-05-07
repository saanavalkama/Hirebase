
using Hirebase.Application.DTOs.Application;

namespace Hirebase.Application.Interfaces.Application;
public interface IApplicationService
{
    public Task<ApplicationResponseDto> Apply(Guid userId, Guid jobPostingId);
    Task<List<Guid>>GetAllCandidateApplicationIds(Guid candidateProfileId);

    Task<List<ApplicationResponseDto>>GetMyApplications(Guid userId);
}