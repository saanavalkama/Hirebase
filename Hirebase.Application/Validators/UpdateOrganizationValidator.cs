using FluentValidation;
using Hirebase.Application.DTOs.Recruiter;

namespace Hirebase.Application.Validators;

public class UpdateOrganizationValidator : AbstractValidator<UpdateOrganizationDto>
{
    public UpdateOrganizationValidator()
    {
      RuleFor(x => x.Name)
      .MinimumLength(1)
      .WithMessage("Name must be at least 1 characters long")
      .MaximumLength(50)
      .WithMessage("Name cannot be over 50 charachters long")
      .When(x => x.Name != null);

      RuleFor(x => x.WebsiteUrl)
      .Must(url => Uri.TryCreate(url, UriKind.Absolute, out var res)
      && (res.Scheme == Uri.UriSchemeHttp || res.Scheme == Uri.UriSchemeHttps))
      .WithMessage("Organization website must be valid URL")
      .When(x => x.WebsiteUrl != null);

      RuleFor(x => x.Location)
      .MinimumLength(1)
      .WithMessage("Location must be at least 1 charachters long")
      .MaximumLength(50)
      .WithMessage("Location cannot be over 50 charachters long")
      .When(x => x.Location != null);
    }
}