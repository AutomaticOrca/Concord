using System;
using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IUserRepository
{
    void Update(AppUser user);
    Task<bool> SaveAllAsync();
    Task<IEnumerable<AppUser>> GetUsersAsync();
    Task<AppUser?> GetUserByIdAsync(int id); // want the ability to return null from our repository methods, so AppUser?
    Task<AppUser?> GetUserByUsernameAsync(string username);

    Task<IEnumerable<MemberDto>> GetMembersAsync();
    Task<MemberDto?> GetMemberAsync(string username);
}
