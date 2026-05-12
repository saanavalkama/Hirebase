using Hirebase.Domain.Entities.Application;

namespace Hirebase.Application.Interfaces.Application; 
public interface IApplicationRepository
{
  public Task <CandidateApplication>Create(CandidateApplication application);
  public Task <CandidateApplication?>GetByCandidateProfileAndJobId(Guid candidateProfileId, Guid jobPostingId);

  public Task <List<CandidateApplication>>GetAllCandidateApplications(Guid candidateProfileId); 

  public Task<List<Guid>>GetAllCandidateJobIds(Guid candidateProfileId);

  public Task<List<CandidateApplication>>GetAllAppliedForJobPostingPaginated(Guid jobPostingId, int page, int pageSize);

  public Task<int>CountApplied(Guid jobPostingId);

  public Task<List<CandidateApplication>> GetPipelineApplications(Guid jobPostingId);

  public Task<CandidateApplication>UpdateApplication(CandidateApplication application);

  public Task<CandidateApplication?>GetByApplicationId(Guid id);

  public Task<bool> Withdraw(Guid jobId, Guid CandidateId);
  
}