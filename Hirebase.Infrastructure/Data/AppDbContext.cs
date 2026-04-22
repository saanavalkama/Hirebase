using Hirebase.Domain.Entities.Auth;
using Microsoft.EntityFrameworkCore;
using Hirebase.Domain.Entities.CandidateProfiles;
using Hirebase.Domain.Enums;

namespace Hirebase.Infrastructure.Data;

public class AppDbContext : DbContext{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    { 
    }
    public DbSet<CandidateProfile> CandidateProfiles {get;set;}

    public DbSet<CandidatePreferredRole> PreferredRoles {get;set;}

    public DbSet<SoftSkill> SoftSkills {get;set;}
    public DbSet<User> Users {get;set;}
    public DbSet<RefreshToken> RefreshTokens {get;set;}
    public DbSet<GitHubProfile>GitHubProfiles {get;set;}
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
            entity.HasIndex(r => r.Token).IsUnique();
            entity.HasIndex(r => r.FamilyId);
            entity.HasIndex(r => r.TokenHash).IsUnique();
            entity.HasOne(r => r.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        });

        modelBuilder.Entity<CandidateProfile>(e =>
        {
            e.HasKey(c => c.Id);
            
            e
              .HasOne(c => c.User)
              .WithOne()
              .HasForeignKey<CandidateProfile>(c => c.UserId)
              .OnDelete(DeleteBehavior.Cascade);

            e
              .HasMany(c => c.SoftSkills)
              .WithOne(s => s.CandidateProfile)
              .HasForeignKey(s => s.CandidateProfileId)
              .OnDelete(DeleteBehavior.Cascade);

            e 
              .HasMany(c => c.PreferredRoles)
              .WithOne(r => r.CandidateProfile)
              .HasForeignKey(r => r.CandidateProfileId)
              .OnDelete(DeleteBehavior.Cascade);


        });

        modelBuilder.Entity<GitHubProfile>(g =>
        {
            g.HasKey(k => k.Id);
            
            g
              .HasOne(g => g.CandidateProfile)
              .WithOne(c => c.GitHubProfile)
              .HasForeignKey<GitHubProfile>(g => g.CandidateProfileId)
              .OnDelete(DeleteBehavior.Cascade);
        });
    }
}