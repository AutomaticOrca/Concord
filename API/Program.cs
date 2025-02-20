using System.Text;
using API.Data;
using API.Entities;
using API.Extensions;
using API.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration); // Extensions/ApplicationServices
builder.Services.AddIdentityServices(builder.Configuration); // Extensions/IndentityServices

// Builds the web application
var app = builder.Build();

// use custom middleware to handle global exceptions
app.UseMiddleware<ExceptionMiddleware>();

// Configure CORS to allow requests from specific origins
app.UseCors(x =>
    x.AllowAnyHeader()
        .AllowAnyMethod()
        .WithOrigins("http://localhost:4200", "https://localhost:4200")
);

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection(); // enforece https

// authentication middleware (JWT-based)
app.UseAuthentication(); // Handles verifying incoming JWT Tokens

// authorization middleware
app.UseAuthorization(); // Handles authenticated users can access protected resources

// Map incoming requests to the appropriate controllers
app.MapControllers();

// Database migration and seeding
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(userManager, roleManager); // Data/Seed.cs
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

// Run the web app
app.Run();
