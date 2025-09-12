import { fetchUserEvents } from "../api/attendees";
import { useAuth } from "../contexts/AuthContext";
import type { EventData } from "../types";
import { EventList } from "../components/events/EventList";
import { useFetch } from "../hooks/useFetch";
import { useCallback } from "react";

export function MyEventsPage() {
  const { auth } = useAuth();
  const getUserEvents = useCallback(
    () => fetchUserEvents(auth?.userId),
    [auth]
  );

  const { data: events, loading, error } = useFetch<EventData[]>(getUserEvents);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">
        Events I'm Attending
      </h1>
      <EventList
        loading={loading}
        error={error?.message ?? null}
        events={events || []}
      />
    </div>
  );
}
