import { fetchEvents } from "../api/events";
import { EventList } from "../components/events/EventList";
import type { EventData } from "../types";
import { useFetch } from "../hooks/useFetch";

export function EventsPage() {
  const { data, loading, error } = useFetch<EventData[]>(fetchEvents);
  const events = data ?? [];

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Events</h1>
      </div>

      <EventList
        loading={loading}
        error={error?.message ?? null}
        events={events}
      />
    </>
  );
}
