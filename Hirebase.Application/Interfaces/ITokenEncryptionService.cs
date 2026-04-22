namespace Hirebase.Application.Interfaces;

public interface ITokenEncryptionService
{
    string Encrypt(string token);
    string Decrypt(string token);
}