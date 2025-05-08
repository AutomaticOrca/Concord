import apiClient from "./httpClient.ts";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { updateUserStatus } from "@/context/AuthContext.tsx";
import { LoginDto, RegisterDto, UserDto } from "@/types";

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  knownAs: z.string().min(1, "Known As is required"),
  gender: z.enum(["male", "female", "na"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(8, "Password must be at most 8 characters"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const register = async (data: RegisterDto): Promise<UserDto> => {
  try {
    const response = await apiClient.post<UserDto>("/account/register", data);
    localStorage.setItem("token", response.data.token);
    console.log(response.data);
    updateUserStatus(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("🔥 Server Response:", error.response.data);
      toast.error(error.response.data?.message || "Registration failed");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
    throw error;
  }
};

export const login = async (data: LoginDto): Promise<UserDto> => {
  try {
    const response = await apiClient.post<UserDto>("/account/login", data);
    localStorage.setItem("token", response.data.token);
    updateUserStatus(response.data);
    console.log("lib/api/auth/login:", response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("🔥 Server Response:", error.response.data);
      toast.error(
        error.response.data?.message || "Invalid username or password"
      );
    } else {
      toast.error("Something went wrong when login. Please try again.");
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  updateUserStatus(null);
};
