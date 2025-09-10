import type { EventData } from "../types";
import { API_BASE_URL, apiFetch } from "./api";

export const fetchEvents = async (): Promise<EventData[]> => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/v1/events`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
