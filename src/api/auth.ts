import type { User } from "../types";
import { API_BASE_URL, apiFetch } from "./api";

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/v1/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    return null;
  }
};
