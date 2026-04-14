using Hirebase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Hirebase.API.Settings;
using Hirebase.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddOptions<ConnectionSettings>()
    .BindConfiguration("ConnectionStrings")
    .ValidateDataAnnotations()
    .ValidateOnStart();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.Run();