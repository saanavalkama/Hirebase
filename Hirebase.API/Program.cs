using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Hirebase.API.Settings;
using Hirebase.API.Middleware;
using Hirebase.Application.Interfaces;
using Hirebase.Infrastructure.Services;
using Hirebase.Infrastructure.Repositories;
using Hirebase.Application.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Hirebase.Application.Validators;
using Hirebase.Application.Settings;

var builder = WebApplication.CreateBuilder(args);

//db
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);


//validation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<RegisterValidator>();

builder.Services.AddOptions<GitHubSettings>()
    .BindConfiguration("GitHub")
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<GitHubSettings>>().Value);

builder.Services.AddOptions<ConnectionSettings>()
    .BindConfiguration("ConnectionStrings")
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICandidateProfileRepository, CandidateProfileRepository>();
builder.Services.AddScoped<ICandidateProfileService, CandidateProfileService>();
builder.Services.AddScoped<IGitHubOAuthService, GitHubOAuthService>();
builder.Services.AddScoped<IGitHubProfileRepository, GitHubProfileRepository>();
builder.Services.AddHttpClient<GitHubOAuthService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDataProtection();
builder.Services.AddScoped<ITokenEncryptionService, TokenEncryptionService>();
builder.Services.AddControllers();
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        var allowedOrigins = builder.Configuration["AllowedOrigins"];
        if(string.IsNullOrEmpty(allowedOrigins)) throw new InvalidOperationException("AllowedOrigins Missigng");
        
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var secret = builder.Configuration["JwtSettings:Secret"];
        if(string.IsNullOrEmpty(secret)) throw new InvalidOperationException("Secret is missing");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            ClockSkew = TimeSpan.Zero
        };
    });

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("AllowClient");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseSwagger();
app.UseSwaggerUI();
app.Run();

public partial class Program{}