namespace API.DTOs;

public class ChatDto
{
    public string ChatPartnerUsername { get; set; } = string.Empty;
    public string ChatPartnerPhotoUrl { get; set; } = string.Empty;
    public string LastMessage { get; set; } = string.Empty;
    public DateTime LastMessageTime { get; set; }
    public int UnreadCount { get; set; }
}