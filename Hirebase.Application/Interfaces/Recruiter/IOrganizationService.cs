using Hirebase.Application.DTOs.Recruiter;

namespace Hirebase.Application.Interfaces.Recruiter;

public interface IOrganizationService
{
    Task<OrganizationResponseDto>Create(CreateOrganizationDto dto,Guid rid);
    Task<List<OrganizationResponseDto>>GetAllByRecruiterId(Guid rid);

    Task<OrganizationResponseDto>Update(UpdateOrganizationDto dto, Guid id, Guid recruiterProfileId);

    Task Delete(Guid id, Guid recruiterProfileId);
}