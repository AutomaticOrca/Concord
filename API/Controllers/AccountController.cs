using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
    : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        // Check if the username already exists in the db
        if (await UserExists(registerDto.Username))
            return BadRequest("Username is token");
        using var hmac = new HMACSHA512();
        var user = mapper.Map<AppUser>(registerDto);
        user.UserName = registerDto.Username.ToLower();
        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
        user.PasswordSalt = hmac.Key;

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return new UserDto
        {
            Username = user.UserName,
            Token = tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
        // Create an instance of HMACSHA512 to hash the password
        // using var hmac = new HMACSHA512();

        // // Create a new user object and set the username and hashed password
        // var user = new AppUser
        // {
        //     Username = registerDto.Username.ToLower(),
        //     PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
        //     PasswordSalt = hmac.Key
        // };

        // // Add the user to the context and save changes to the database
        // context.Users.Add(user);
        // await context.SaveChangesAsync();

        // // Return the newly created user
        // return new UserDto { UserName = user.Username, Token = tokenService.CreateToken(user) };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        // Find the user in db by username
        var user = await context
            .Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

        // If the user doesn't exist, return an unauthorized response
        if (user == null)
            return Unauthorized("Invalid username");

        // Recreate the HMACSHA512 instance with the user's stored password salt
        using var hmac = new HMACSHA512(user.PasswordSalt);

        // Hash the input password using the same salt and HMACSHA512
        var ComputeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        // Compare the hashed input password with the stored password hash byte by byte
        for (int i = 0; i < ComputeHash.Length; i++)
        {
            if (ComputeHash[i] != user.PasswordHash[i])
                return Unauthorized("Invalid password");
        }

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
        return await context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
    }
}
