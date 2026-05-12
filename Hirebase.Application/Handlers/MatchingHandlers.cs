using Hangfire;
using Hirebase.Application.Events;
using Hirebase.Application.Interfaces;
using MediatR;

namespace Hirebase.Application.Handlers;

public class CandidateProfileCreatedHandler : INotificationHandler<CandidateProfileCreatedEvent>
{
    private readonly IBackgroundJobClient _jobClient;

    public CandidateProfileCreatedHandler(IBackgroundJobClient jobClient)
    {
        _jobClient = jobClient;
    }

    public Task Handle(CandidateProfileCreatedEvent notification, CancellationToken cancellationToken)
    {
        _jobClient.Enqueue<IPotentialMatchService>(s => s.ScoreForCandidate(notification.CandidateProfileId));
        return Task.CompletedTask;
    }
}

public class CandidateProfileUpdatedHandler : INotificationHandler<CandidateProfileUpdatedEvent>
{
    private readonly IBackgroundJobClient _jobClient;

    public CandidateProfileUpdatedHandler(IBackgroundJobClient jobClient)
    {
        _jobClient = jobClient;
    }

    public Task Handle(CandidateProfileUpdatedEvent notification, CancellationToken cancellationToken)
    {
        _jobClient.Enqueue<IPotentialMatchService>(s => s.ScoreForCandidate(notification.CandidateProfileId));
        return Task.CompletedTask;
    }
}

public class JobPostingCreatedHandler : INotificationHandler<JobPostingCreatedEvent>
{
    private readonly IBackgroundJobClient _jobClient;

    public JobPostingCreatedHandler(IBackgroundJobClient jobClient)
    {
        _jobClient = jobClient;
    }

    public Task Handle(JobPostingCreatedEvent notification, CancellationToken cancellationToken)
    {
        _jobClient.Enqueue<IPotentialMatchService>(s => s.ScoreForJob(notification.JobPostingId));
        return Task.CompletedTask;
    }
}

public class JobPostingUpdatedHandler : INotificationHandler<JobPostingUpdatedEvent>
{
    private readonly IBackgroundJobClient _jobClient;

    public JobPostingUpdatedHandler(IBackgroundJobClient jobClient)
    {
        _jobClient = jobClient;
    }

    public Task Handle(JobPostingUpdatedEvent notification, CancellationToken cancellationToken)
    {
        _jobClient.Enqueue<IPotentialMatchService>(s => s.ScoreForJob(notification.JobPostingId));
        return Task.CompletedTask;
    }
}

public class GitHubSignalsUpdatedHandler : INotificationHandler<GitHubSignalsUpdatedEvent>
{
    private readonly IBackgroundJobClient _jobClient;

    public GitHubSignalsUpdatedHandler(
        IBackgroundJobClient jobClient
    )
    {
        _jobClient = jobClient;
    }

    public Task Handle(GitHubSignalsUpdatedEvent notification, CancellationToken ct)
    {
        _jobClient.Enqueue<IPotentialMatchService>(s => s.ScoreForCandidate(notification.CandidateProfileId));
        return Task.CompletedTask;
    }
}