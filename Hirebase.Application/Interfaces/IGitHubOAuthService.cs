namespace Hirebase.Application.Interfaces;

public interface IGitHubOAuthService
{
    Task HandleCallback(string code, Guid userId);
    Task RefreshAsync(Guid userId);
}