using Api.Vaildators.Messages;
using Core.Dtos.Auth;
using FluentValidation;

namespace Api.Vaildators.Auth;

public class RegistrationValidator : AbstractValidator<RegisterDto>
{
    public RegistrationValidator()
    {
        RuleFor(p => p.Credential).NotEmpty().NotNull().EmailAddress();
        RuleFor(p => p.Password).NotEmpty().NotNull().MinimumLength(8);

        RuleFor(p => p.FirstName).NotEmpty().NotNull();
        RuleFor(p => p.LastName).NotEmpty().NotNull();
    }
}