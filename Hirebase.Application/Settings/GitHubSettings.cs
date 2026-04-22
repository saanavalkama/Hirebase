using System.ComponentModel.DataAnnotations;

namespace Hirebase.Application.Settings;

public class GitHubSettings
{
    [Required] public string ClientId { get; set; } = string.Empty;
    [Required] public string ClientSecret { get; set; } = string.Empty;
    [Required] public string RedirectUri { get; set; } = string.Empty;
}