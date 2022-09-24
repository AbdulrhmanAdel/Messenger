using Core.Dtos.Conversation;
using Core.Entities.Conversation;
using FluentValidation;

namespace Api.Vaildators.Conversation;

public class CreateConversationValidator : AbstractValidator<CreateConversationDto>
{
    public CreateConversationValidator()
    {
        RuleFor(m => m.ConversationType)
            .IsInEnum();
        RuleFor(m => m.RecipientIds).NotNull().NotEmpty();
        When(m => m.ConversationType == ConversationType.Private,
            () =>
            {
                RuleFor(m => m.RecipientIds)
                    .Must(ids => ids.Count == 1);
            });
    }
}