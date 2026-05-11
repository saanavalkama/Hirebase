
using Hirebase.Application.DTOs.Application;
using Hirebase.Application.DTOs.Common;

namespace Hirebase.Application.Interfaces.Application;
public interface IApplicationService
{
    Task<ApplicationResponseDto> Apply(Guid userId, Guid jobPostingId);
    Task<List<Guid>>GetAllCandidateApplicationIds(Guid candidateProfileId);

    Task<List<ApplicationResponseDto>>GetMyApplications(Guid userId);

    Task<PaginatedResponse<RecruiterApplicationResponseDto>>GetAllAppliedByJobPostingIdPaginated(Guid jobPostingId, Guid userId, int page, int pageSize);

    Task<List<RecruiterApplicationResponseDto>> GetPipeline(Guid jobPostingId, Guid userId);

    Task<ApplicationResponseDto>UpdateApplication(Guid applicationId, Guid userId, UpdateStageDto dto);

    Task<bool>Withdraw(Guid jobPostingId, Guid userId);
}