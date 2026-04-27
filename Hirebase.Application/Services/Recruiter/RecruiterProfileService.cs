using Hirebase.Application.DTOs.Recruiter;
using Hirebase.Application.Interfaces.Recruiter;
using Hirebase.Domain.Exceptions;
using Hirebase.Domain.Entities.Recruiter;


namespace Hirebase.Application.Services.Recruiter;

public class RecruiterProfileService : IRecruiterProfileService
{
    private readonly IRecruiterProfileRepository _repo;

    public RecruiterProfileService(
        IRecruiterProfileRepository repo
    ){
        _repo = repo;
    }

    public async Task<RecruiterProfileResponseDto>Create(CreateRecruiterProfileDto dto, Guid userId)
    {
        var existing = await _repo.FindRecruiterByUserId(userId);
        if(existing != null) throw new ConflictException("Profile already created");

        var profile =  new RecruiterProfile
        {
            UserId = userId,
            Name = dto.Name
        };

        var savedProfile = await  _repo.Create(profile);

        return MapToDto(savedProfile);
    }

    public async Task<RecruiterProfileResponseDto>GetRecruiterProfileByUserId(Guid userId)
    {
        var profile = await _repo.FindRecruiterByUserId(userId);
        if(profile == null) throw new NotFoundException("Recruiter profile");
        return MapToDto(profile);
    }

    public async Task<RecruiterProfileResponseDto>Update(UpdateRecruiterProfileDto dto, Guid userId)
    {
        var profile = await _repo.FindRecruiterByUserId(userId);
        if(profile == null) throw new NotFoundException("Recruiter profile");

        if(dto.Name != null) profile.Name = dto.Name;
        profile.UpdatedAt = DateTime.UtcNow;

        var updatedProfile = await _repo.Update(profile);

        return MapToDto(updatedProfile);


    }

    public async Task Delete(Guid userId)
    {
        await _repo.DeleteRecruiterProfile(userId);
    }

    private RecruiterProfileResponseDto MapToDto(RecruiterProfile profile) => new(
        profile.Id,
        profile.UserId,
        profile.Name,
        profile.CreatedAt,
        profile.UpdatedAt,
        profile.Organizations.Select(o => new OrganizationResponseDto(
            o.Id,
            o.Name,
            o.WebsiteUrl,
            o.Location,
            o.CreatedAt,
            o.UpdatedAt
        )).ToList()
    );


}