import apiClient from "./httpClient.ts";
import axios from "axios";
import { toast } from "sonner";
import { MemberDto, PhotoDto } from "@/types";

/**
 * get user info
 * @param username
 * @returns Promise<MemberDto>
 */
export const getUser = async (username: string): Promise<MemberDto> => {
  try {
    const response = await apiClient.get<MemberDto>(`/users/${username}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("🔥 Server Response:", error.response.data);
      toast.error(error.response.data?.message || "Failed to fetch user data");
    } else {
      toast.error("Something went wrong while fetching user data.");
    }
    throw error;
  }
};

/**
 * Update the current user's profile information
 * @param data Partial user profile data to be updated
 * @returns Promise<void>
 */
export const updateUser = async (data: Partial<MemberDto>): Promise<void> => {
  try {
    await apiClient.put("/users", data);
    toast.success("Profile updated successfully!");
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("🔥 Update failed:", error.response.data);
      toast.error(error.response.data?.message || "Failed to update profile.");
    } else {
      toast.error("An error occurred while updating profile.");
    }
    throw error;
  }
};

/**
 * Set a specific photo as the main profile photo
 * @param photoId - ID of the photo to set as main
 * @returns Promise<void>
 */
export const setMainPhoto = async (photoId: number): Promise<void> => {
  try {
    await apiClient.put(`/users/set-main-photo/${photoId}`);
    toast.success("Main photo updated!");
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("🔥 Failed to set main photo:", error.response.data);
      toast.error(error.response.data?.message || "Failed to set main photo.");
    } else {
      toast.error("Something went wrong while setting main photo.");
    }
    throw error;
  }
};

export const uploadPhoto = async (file: File): Promise<PhotoDto> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await apiClient.post<PhotoDto>("/users/add-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Photo uploaded!");
    return res.data;
  } catch (err) {
    toast.error("Upload failed.");
    throw err;
  }
};

export const deletePhoto = async (photoId: number): Promise<void> => {
  try {
    await apiClient.delete(`/users/delete-photo/${photoId}`);
    toast.success("Photo deleted!");
  } catch (err) {
    toast.error("Delete failed.");
    throw err;
  }
};
