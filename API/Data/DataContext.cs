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

        // Configure one-to-many relationship for messages:
        // One recipient can receive many messages
        builder
            .Entity<Message>()
            .HasOne(x => x.Recipient) // Each message has one recipient
            .WithMany(x => x.MessagesReceived) // One user can receive multiple messages
            .OnDelete(DeleteBehavior.Restrict); // Prevents automatic deletion of messages if recipient is deleted

        // Configure one-to-many relationship for messages:
        // One sender can send many messages
        builder
            .Entity<Message>()
            .HasOne(x => x.Sender)
            .WithMany(x => x.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
