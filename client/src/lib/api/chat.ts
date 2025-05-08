import apiClient from "@/lib/api/httpClient.ts";
import axios from "axios";
import { toast } from "sonner";
import {MessageDto} from "@/types";

export const getMessageThread = async (username: string): Promise<MessageDto[]> => {
    try {
        const response = await apiClient.get<MessageDto[]>(`/messages/thread/${username}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("🔥 Server Response:", error.response.data);
            toast.error(error.response.data?.message || "Failed to fetch messages");
        } else {
            toast.error("Something went wrong while fetching messages.");
        }
        throw error;
    }
};

export const sendMessage = async (recipientUsername: string, content: string): Promise<MessageDto> => {
    try {
        const response = await apiClient.post<MessageDto>("/messages", {
            recipientUsername,
            content,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("🔥 Server Response:", error.response.data);
            toast.error(error.response.data?.message || "Failed to send message");
        } else {
            toast.error("Something went wrong while sending message.");
        }
        throw error;
    }
};
