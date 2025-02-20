using System;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using SQLitePCL;

namespace API.Data;

public class MessageRepository(DataContext context, IMapper mapper) : IMessageRepository
{
    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(int id)
    {
        return await context.Messages.FindAsync(id);
    }

    // Get message conversation between two users
    public async Task<IEnumerable<MessageDto>> GetMessageThread(
        string currentUsername,
        string recipientUsername
    )
    {
        var messages = await context
            .Messages.Include(x => x.Sender)
            .ThenInclude(x => x.Photos)
            .Include(x => x.Recipient)
            .ThenInclude(x => x.Photos)
            .Where(x =>
                x.RecipientUsername == currentUsername
                    && x.RecipientDeleted == false
                    && x.SenderUsername == recipientUsername
                || x.SenderUsername == currentUsername
                    && x.SenderDeleted == false
                    && x.RecipientUsername == recipientUsername
            )
            .OrderBy(x => x.MessageSent)
            .ToListAsync();

        // Filter out unread messages where the current user is the recipient
        var unreadMessages = messages
            .Where(x => x.DateRead == null && x.RecipientUsername == currentUsername)
            .ToList();

        // If there are unread messages, mark them as read and update the database
        if (unreadMessages.Count != 0)
        {
            unreadMessages.ForEach(x => x.DateRead = DateTime.Now);
            await context.SaveChangesAsync();
        }

        // Map the Message entities to MessageDto objects and return the result
        return mapper.Map<IEnumerable<MessageDto>>(messages);
    }

    public async Task<PagedList<MessageDto>> GetMssagesForUsers(MessageParams messageParams)
    {
        // most recent messages first
        var query = context.Messages.OrderByDescending(x => x.MessageSent).AsQueryable();

        // Apply filters based on the message container
        query = messageParams.Container switch
        {
            // user is the recipient
            "Inbox"
                => query.Where(x =>
                    x.Recipient.UserName == messageParams.Username && x.RecipientDeleted == false
                ),
            // user is the sender
            "Outbox"
                => query.Where(x =>
                    x.Sender.UserName == messageParams.Username && x.SenderDeleted == false
                ),
            // Default: user is the recipient
            _
                => query.Where(x =>
                    x.Recipient.UserName == messageParams.Username
                    && x.DateRead == null
                    && x.RecipientDeleted == false
                )
        };

        var messages = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);

        return await PagedList<MessageDto>.CreateAsync(
            messages,
            messageParams.PageNumber,
            messageParams.PageSize
        );
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
