using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class TokenService(IConfiguration config, UserManager<AppUser> userManager) : ITokenService
{
    public async Task<string> CreateToken(AppUser user)
    {
        var tokenKey =
            config["TokenKey"] ?? throw new Exception("Cannot access tokenKey from appsettings");
        if (tokenKey.Length < 64)
            throw new Exception("Your tokenKey needs to be longer");

        // create a new symmetric security key
        // by using encoding and then UTF8 just as with them before and get bytes.
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

        if (user.UserName == null)
            throw new Exception("No username for user");

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName)
        };

        var roles = await userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims), // Subject: Gets or sets the output claims to be included in the issued token.
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = creds // Gets or sets the credentials that are used to sign the token.
        };

        var tokenHandler = new JwtSecurityTokenHandler(); // Initialize the token handler, which will create and serialize the token.
        var token = tokenHandler.CreateToken(tokenDescriptor); // Create the token using the token handler and token descriptor

        return tokenHandler.WriteToken(token); // Serialize the token to a string and return
    }
}
