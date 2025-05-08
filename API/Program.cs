using System.Text;
using API.Data;
using API.Entities;
using API.Extensions;
using API.Middleware;
using API.SignalR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "CorsPolicy",
        builder =>
        {
            builder
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .WithOrigins(
                    "http://localhost:5173",
                    "https://localhost:5173",
                    "http://localhost:5174",
                    "https://localhost:5174"
                );
        }
    );
});

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration); // Extensions/ApplicationServices
builder.Services.AddIdentityServices(builder.Configuration); // Extensions/IndentityServices

// Builds the web application
var app = builder.Build();

app.UseWebSockets();

app.UseCors("CorsPolicy");

// use custom middleware to handle global exceptions
app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// authentication middleware (JWT-based)
app.UseAuthentication();

// authorization middleware
app.UseAuthorization();

// wwwroot
app.UseStaticFiles();

// Map incoming requests to the appropriate controllers
app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");

// SPA
app.MapFallbackToFile("index.html");

// Database migration and seeding
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    await context.Database.ExecuteSqlRawAsync("DELETE FROM [Connections]");
    await Seed.SeedUsers(userManager, roleManager); // Data/Seed.cs
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

// Run the web app
app.Run();
