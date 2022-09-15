using Api.Vaildators.Messages;
using Core.Dtos.Auth;
using FluentValidation;

namespace Api.Vaildators.Auth;

public class LoginValidator : AbstractValidator<LoginDto>
{
    public LoginValidator()
    {
        RuleFor(p => p.Credential).NotEmpty().NotNull().EmailAddress();
        RuleFor(p => p.Password).NotEmpty().NotNull().MinimumLength(8);
    }
}