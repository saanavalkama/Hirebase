using Hirebase.Application.Interfaces;
using Hirebase.Domain.Entities.Auth;
using Hirebase.Domain.Utils;
using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hirebase.Infrastructure.Repositories;

public class AuthRepository: IAuthRepository
{
    private readonly AppDbContext _context;

    public AuthRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> FindByEmail(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User> CreateUser(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task SaveRefreshToken(RefreshToken rt)
    {
        _context.RefreshTokens.Add(rt);
        await _context.SaveChangesAsync();
    }

    public async Task<RefreshToken?> GetRefreshToken(string token)

   
    {
         var hash = HashUtils.ComputeSha256(token);
        return await _context.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.TokenHash == hash);
    }

    public async Task RevokeRefreshToken(RefreshToken token)
    {
        token.RevokedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task RevokeFamily(Guid familyId)
    {
        var tokens = await _context.RefreshTokens.Where(r => r.FamilyId == familyId).ToListAsync();
        foreach(var token in tokens)
            token.RevokedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task RevokeAllByUserId(Guid userId)
    {
        var tokens = await _context.RefreshTokens.Where(r => r.UserId == userId && r.RevokedAt == null).ToListAsync();

        foreach(var token in tokens)
            token.RevokedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

}