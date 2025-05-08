export interface MessageDto {
    id: number;
    senderUsername: string;
    senderPhotoUrl: string | null;
    recipientUsername: string;
    recipientPhotoUrl: string | null;
    content: string;
    messageSent: string;
    dateRead?: string;
}

export interface CreateMessageDto {
    recipientUsername: string;
    content: string;
}
