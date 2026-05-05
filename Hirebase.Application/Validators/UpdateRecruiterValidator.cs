using FluentValidation;
using Hirebase.Application.DTOs.Recruiter;

namespace Hirebase.Application.Validators;

public class UpdateRecruiterProfile : AbstractValidator<UpdateRecruiterProfileDto>
{
    public UpdateRecruiterProfile()
    {
        RuleFor(x => x.Name)
        .MinimumLength(1)
        .WithMessage("Name must be at least 1 charachters long")
        .MaximumLength(50)
        .WithMessage("Name cannot be over 50 charachters long")
        .When(x=>x.Name != null);
    }
}