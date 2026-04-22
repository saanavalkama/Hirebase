using Hirebase.Application.Interfaces;
using Microsoft.AspNetCore.DataProtection;

namespace Hirebase.Infrastructure.Services;

public class TokenEncryptionService : ITokenEncryptionService
{
    private readonly IDataProtector _protector;

    public TokenEncryptionService(IDataProtectionProvider provider)
    {
        _protector = provider.CreateProtector("Hirebase.Tokens");
    }

    public string Encrypt(string token) => _protector.Protect(token);
    public string Decrypt(string token) => _protector.Unprotect(token);
}