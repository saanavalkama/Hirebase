using Hirebase.Domain.Enums;

namespace Hirebase.Domain.Entities.Auth;

public class User
{
    public Guid Id {get;set;} = Guid.NewGuid();
    public string Email {get;set;} = string.Empty;
    public string PasswordHash {get;set;} = string.Empty;

    public UserRole Role {get;set;}

    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;

    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public ICollection<RefreshToken> RefreshTokens {get;set;} = [];
}