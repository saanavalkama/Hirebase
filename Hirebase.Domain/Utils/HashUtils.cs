// Infrastructure/Utils/HashUtils.cs
using System.Security.Cryptography;
using System.Text;

namespace Hirebase.Domain.Utils;

public static class HashUtils
{
    public static string ComputeSha256(string input)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToLower();
    }
}