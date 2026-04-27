using Hirebase.Application.DTOs.CandidateProfile;

namespace Hirebase.Application.Interfaces;

public interface ICandidateProfileService
{
    public Task<CandidateProfileResponseDto> CreateProfile(Guid userId);
    public Task <CandidateProfileResponseDto>UpdateProfile(UpdateCandidateProfileDto dto, Guid userId);
    public Task <CandidateProfileResponseDto>GetProfile(Guid userId);
}