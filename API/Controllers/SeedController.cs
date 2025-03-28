using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class SeedController(
    UserManager<AppUser> userManager,
    RoleManager<AppRole> roleManager,
    DataContext context
) : BaseApiController
{
    [HttpPost("reset")]
    public async Task<ActionResult> ResetAndSeed()
    {
        await context.Database.ExecuteSqlRawAsync("DELETE FROM [Connections]");
        await context.Messages.ExecuteDeleteAsync();
        await context.UserRoles.ExecuteDeleteAsync();
        await context.Users.ExecuteDeleteAsync();
        await context.Roles.ExecuteDeleteAsync();

        await Seed.SeedUsers(userManager, roleManager);

        return Ok("Seeding completed.");
    }
}
