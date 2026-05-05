using System.Data;
using FluentValidation;
using Hirebase.Application.DTOs.CandidateProfile;
using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Domain.Enums;

namespace Hirebase.Application.Validators;

public class UpdateCandidateValidator : AbstractValidator<UpdateCandidateProfileDto>
{
    public UpdateCandidateValidator()
    {
        RuleFor(x => x.Name)
        .MinimumLength(2).WithMessage("Name must be at least 2 characters")
        .MaximumLength(50).WithMessage("Name is too long")
        .Matches(@"^[\p{L}\s\-']+$").WithMessage("Name can only contain letters, spaces, hyphens and apostrophes")
        .When(x => x.Name != null);

        RuleFor(x => x.Location)
        .MinimumLength(2).WithMessage("Name must be at least 2 characters")
        .MaximumLength(50).WithMessage("Name is too long")
        .When(x => x.Name != null);

        RuleFor(x=>x.Bio)
        .MinimumLength(2).WithMessage("Name must be at least 2 characters")
        .MaximumLength(300).WithMessage("Name is too long")
        .When(x => x.Name != null);

        RuleFor(x => x.LinkedInUrl)
        .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out var res)
        && (res.Scheme == Uri.UriSchemeHttp || res.Scheme == Uri.UriSchemeHttps))
        .WithMessage("LinkedIn URL must be a valid URL")
        .When(x => x.LinkedInUrl != null);

        RuleFor(x => x.PersonalSiteUrl)
        .Must(uri => Uri.TryCreate(uri,UriKind.Absolute, out var res)
        &&(res.Scheme == Uri.UriSchemeHttp || res.Scheme == Uri.UriSchemeHttps))
        .WithMessage("Personal site URL must be valid URL")
        .When(x => x.PersonalSiteUrl != null);

        RuleFor(x => x.CvUrl)
        .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out var res)
        && (res.Scheme == Uri.UriSchemeHttp || res.Scheme == Uri.UriSchemeHttps))
        .WithMessage("CV URL must be valid URL")
        .When(x => x.CvUrl != null);

        RuleFor(x => x.YearsOfExperience)
        .GreaterThanOrEqualTo(0).WithMessage("Years of experience cannot be negative")
        .LessThanOrEqualTo(50).WithMessage("Years of experience seems unrealistic")
        .When(x => x.YearsOfExperience != null);

        RuleFor(x=>x.SalaryMin)
        .GreaterThanOrEqualTo(0).WithMessage("Minimum salary cannot be negative")
        .LessThanOrEqualTo(10000000).WithMessage("Minimum salary cannot be more than 10000000")
        .When(x => x.SalaryMin != null);

         RuleFor(x=>x.SalaryMax)
        .GreaterThanOrEqualTo(0).WithMessage("Minimum salary cannot be negative")
        .LessThanOrEqualTo(10000000).WithMessage("Minimum salary cannot be more than 10000000")
        .When(x => x.SalaryMax != null);
    
        RuleFor(x => x.AvailableFrom)
        .GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow))
        .WithMessage("Available from must be a future date")
        .When(x => x.AvailableFrom != null);

        RuleFor(x => x.SeniorityLevel)
        .Must(val => Enum.TryParse<SeniorityLevel>(val, out _))
        .WithMessage("Invalid seniority level")
        .When(x => x.SeniorityLevel != null);

        RuleFor(x => x.RemotePreference)
        .Must(val => Enum.TryParse<RemotePreference>(val, out _))
        .WithMessage("Invalid remote preference type")
        .When(x => x.RemotePreference != null);

        RuleForEach(x => x.SoftSkills)
        .Must(val => Enum.TryParse<SoftSkillType>(val, out _))
        .WithMessage("Value must be valid soft skill")
        .When(x => x.SoftSkills != null);

        RuleForEach(x => x.PreferredRoles)
        .Must(val => Enum.TryParse<PreferredRoleType>(val, out _))
        .WithMessage("Value needs to be in preferred roles")
        .When(x => x.PreferredRoles != null);

    }

}