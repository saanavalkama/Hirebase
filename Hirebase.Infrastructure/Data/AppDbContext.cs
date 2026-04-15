using Hirebase.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hirebase.Infrastructure.Data;

public class AppDbContext : DbContext{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    { 
    }

    public DbSet<User> Users {get;set;}
    public DbSet<RefreshToken> RefreshTokens {get;set;}
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Email).IsRequired();
            entity.Property(u => u.PasswordHash).IsRequired();
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.HasOne(r => r.User)
                .WithOne(u => u.RefreshToken)
                .HasForeignKey<RefreshToken>(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        });
    }
}