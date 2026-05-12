using MediatR;

namespace Hirebase.Application.Events;

public record CandidateProfileCreatedEvent(Guid CandidateProfileId) : INotification;
public record CandidateProfileUpdatedEvent(Guid CandidateProfileId) : INotification;
public record JobPostingCreatedEvent(Guid JobPostingId) : INotification;
public record JobPostingUpdatedEvent(Guid JobPostingId) : INotification;
public record GitHubProfileConnectedEvent(Guid CandidateProfileId) : INotification;
public record GitHubSignalsUpdatedEvent(Guid CandidateProfileId) : INotification;