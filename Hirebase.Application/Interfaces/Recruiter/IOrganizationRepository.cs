using Hirebase.Domain.Entities.Recruiter;

namespace Hirebase.Application.Interfaces.Recruiter;

public interface IOrganizationRepository
{
    Task<Organization>Create(Organization org);
    Task<Organization>Update(Organization org);
    Task Delete(Guid id);
    Task<Organization?> GetById(Guid id);
    Task<List<Organization>>GetAllByRecruiterProfileId(Guid rid);


}