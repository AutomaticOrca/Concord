import apiClient from "@/lib/api/httpClient.ts";
import axios from "axios"
import { toast } from "sonner";
import {ChatDto} from "@/types";

export const getUserChats = async (): Promise<ChatDto[]> => {
    try {
        const response = await apiClient.get<ChatDto[]>("/messages/chats");
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("🔥 Server Response:", error.response.data);
            toast.error(error.response.data?.message || "Failed to fetch chats");
        } else {
            toast.error("Something went wrong while fetching chats.");
        }
        throw error;
    }
};