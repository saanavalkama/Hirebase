using Hirebase.Application.DTOs.Recruiter;
using Hirebase.Application.Interfaces.Recruiter;
using Hirebase.Domain.Entities.Recruiter;
using Hirebase.Domain.Exceptions;

namespace Hirebase.Application.Services.Recruiter;

public class OrganizationService : IOrganizationService
{
    private readonly IOrganizationRepository _repo;

    public OrganizationService(
        IOrganizationRepository repo
    )
    {
        _repo = repo;
    }

    public async Task<OrganizationResponseDto>Create(CreateOrganizationDto dto, Guid rid)
    {
        var org = new Organization
        {
            RecruiterProfileId = rid,
            Name = dto.Name,
            WebsiteUrl = dto.WebsiteUrl,
            Location = dto.Location,

        };

        var savedOrg = await _repo.Create(org);
        return MapToDto(savedOrg);
    }

    public async Task<List<OrganizationResponseDto>>GetAllByRecruiterId(Guid rid)
    {
        var orgs = await _repo.GetAllByRecruiterProfileId(rid);
        if(orgs == null) throw new NotFoundException("Organization");
        return orgs.Select(o => MapToDto(o)).ToList();
    }

    public async Task<OrganizationResponseDto>Update(UpdateOrganizationDto dto, Guid id)
    {
        var org = await _repo.GetById(id);
        if(org == null) throw new NotFoundException("Organization");

        if(dto.Name != null) org.Name = dto.Name;
        if(dto.WebsiteUrl != null) org.WebsiteUrl = dto.WebsiteUrl;
        if(dto.Location != null) org.Location = dto.Location;
        org.UpdatedAt = DateTime.UtcNow;

        var updated = await _repo.Update(org);
        return MapToDto(updated);
    }

    public async Task Delete(Guid id)
    {
    await _repo.Delete(id);
    }

    private OrganizationResponseDto MapToDto(Organization org) => new(
        org.Id,
        org.Name,
        org.WebsiteUrl,
        org.Location,
        org.CreatedAt,
        org.UpdatedAt
    );
    
}