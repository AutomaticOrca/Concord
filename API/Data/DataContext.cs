using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

// DbContext class for database interaction
public class DataContext(DbContextOptions options) : DbContext(options)
{
    // DbSets representing tables
    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }

    // Configure entity relationships and keys
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure one-to-many relationship: SourceUser -> LikedUsers
        builder.Entity<UserLike>().HasKey(k => new { k.SourceUserId, k.TargetUserId });
        builder
            .Entity<UserLike>()
            .HasOne(s => s.SourceUser)
            .WithMany(l => l.LikedUsers)
            .HasForeignKey(s => s.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure one-to-many relationship: TargetUser -> LikedByUsers
        builder
            .Entity<UserLike>()
            .HasOne(s => s.TargetUser)
            .WithMany(l => l.LikedByUsers)
            .HasForeignKey(s => s.TargetUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .Entity<Message>()
            .HasOne(x => x.Recipient)
            .WithMany(x => x.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .Entity<Message>()
            .HasOne(x => x.Sender)
            .WithMany(x => x.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
