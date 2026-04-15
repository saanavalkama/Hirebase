using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Hirebase.API.Settings;
using Hirebase.API.Middleware;
using Hirebase.Application.Interfaces;
using Hirebase.Infrastructure.Services;
using System.IdentityModel.Tokens.Jwt;
using Hirebase.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddOptions<ConnectionSettings>()
    .BindConfiguration("ConnectionStrings")
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.Run();