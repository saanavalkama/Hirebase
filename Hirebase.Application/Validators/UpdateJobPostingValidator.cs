using FluentValidation;
using Hirebase.Application.DTOs.Recruiter;
using Hirebase.Domain.Enums;

namespace Hirebase.Application.Validators;

public class UpdateJobPostingValidator : AbstractValidator<UpdateJobPostingDto>
{
    private static readonly string[] ValidStatuses = ["Draft", "Open", "Closed"];

    public UpdateJobPostingValidator()
    {
        RuleFor(x => x.Title)
            .MinimumLength(1).WithMessage("Title cannot be empty")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters")
            .When(x => x.Title != null);

        RuleFor(x => x.Description)
            .MinimumLength(1).WithMessage("Description cannot be empty")
            .MaximumLength(5000).WithMessage("Description cannot exceed 5000 characters")
            .When(x => x.Description != null);

        RuleFor(x => x.Status)
            .Must(s => ValidStatuses.Contains(s!))
            .WithMessage($"Status must be one of: {string.Join(", ", ValidStatuses)}")
            .When(x => x.Status != null);

        RuleFor(x => x.SeniorityLevel)
            .Must(val => Enum.TryParse<SeniorityLevel>(val, out _))
            .WithMessage("Invalid seniority level")
            .When(x => x.SeniorityLevel != null);

        RuleFor(x => x.RemotePreference)
            .Must(val => Enum.TryParse<RemotePreference>(val, out _))
            .WithMessage("Invalid remote preference")
            .When(x => x.RemotePreference != null);

        RuleFor(x => x.Location)
            .MaximumLength(100).WithMessage("Location cannot exceed 100 characters")
            .When(x => x.Location != null);

        RuleFor(x => x.SalaryMin)
            .GreaterThanOrEqualTo(0).WithMessage("Minimum salary cannot be negative")
            .LessThanOrEqualTo(10_000_000).WithMessage("Minimum salary is unrealistically high")
            .When(x => x.SalaryMin != null);

        RuleFor(x => x.SalaryMax)
            .GreaterThanOrEqualTo(0).WithMessage("Maximum salary cannot be negative")
            .LessThanOrEqualTo(10_000_000).WithMessage("Maximum salary is unrealistically high")
            .GreaterThanOrEqualTo(x => x.SalaryMin!.Value)
            .WithMessage("Maximum salary must be greater than or equal to minimum salary")
            .When(x => x.SalaryMax != null && x.SalaryMin != null);

        RuleFor(x => x.LastApplicationDay)
            .GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("Last application day must be a future date")
            .When(x => x.LastApplicationDay != null);

        RuleFor(x => x.PreferredRole)
            .Must(val => Enum.TryParse<PreferredRoleType>(val, out _))
            .WithMessage("Invalid preferred role")
            .When(x => x.PreferredRole != null);

        RuleFor(x => x.JobPostingSoftSkills)
            .Must(list => list.Count <= 3)
            .WithMessage("You can select at most 3 soft skills");

        RuleForEach(x => x.JobPostingSoftSkills)
            .Must(val => Enum.TryParse<SoftSkillType>(val, out _))
            .WithMessage("Invalid soft skill value");

        RuleForEach(x => x.RequiredLanguages)
            .NotEmpty().WithMessage("Language name cannot be empty")
            .MaximumLength(50).WithMessage("Language name is too long")
            .When(x => x.RequiredLanguages != null);
    }
}
