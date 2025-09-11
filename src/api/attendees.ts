import type { EventData } from "../types";
import { API_BASE_URL, apiFetch } from "./api";

export const fetchUserEvents = async (
  userId: number | undefined
): Promise<EventData[]> => {
  if (!userId) {
    return [];
  }

  try {
    const response = await apiFetch(
      `${API_BASE_URL}/v1/attendees/${userId}/events`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching events for user ${userId}:`, error);
    throw error;
  }
};
