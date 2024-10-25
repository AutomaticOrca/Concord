using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(
    UserManager<AppUser> userManager,
    ITokenService tokenService,
    IMapper mapper
) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        // Check if the username already exists in the db
        if (await UserExists(registerDto.Username))
            return BadRequest("Username is token");

        var user = mapper.Map<AppUser>(registerDto);
        user.UserName = registerDto.Username.ToLower();

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return new UserDto
        {
            Username = user.UserName,
            Token = tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        // Find the user in db by username
        var user = await userManager
            .Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.NormalizedUserName == loginDto.Username.ToUpper());

        // If the user doesn't exist, return an unauthorized response
        if (user == null || user.UserName == null)
            return Unauthorized("Invalid username");

        var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

        if (!result)
            return Unauthorized();

        // If the password is valid, return the user object
        return new UserDto
        {
            Username = user.UserName,
            KnownAs = user.KnownAs,
            Token = tokenService.CreateToken(user),
            Gender = user.Gender,
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
        };
    }

    private async Task<bool> UserExists(string username)
    {
        return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
    }
}
