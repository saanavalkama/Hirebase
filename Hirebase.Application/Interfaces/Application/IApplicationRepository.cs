using Hirebase.Domain.Entities.Application;

namespace Hirebase.Application.Interfaces.Application; 
public interface IApplicationRepository
{
  public Task <CandidateApplication>Create(CandidateApplication application);
  public Task <CandidateApplication?>GetByCandidateProfileAndJobId(Guid candidateProfileId, Guid jobPostingId);

  public Task <List<CandidateApplication>>GetAllCandidateApplications(Guid candidateProfileId); 

  public Task<List<Guid>>GetAllCandidateJobIds(Guid candidateProfileId);
  
}