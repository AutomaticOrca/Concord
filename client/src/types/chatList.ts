export interface ChatDto {
  chatPartnerUsername: string;
  chatPartnerPhotoUrl: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}
