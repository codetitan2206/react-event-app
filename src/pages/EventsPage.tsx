import { useState } from "react";
import { fetchEvents } from "../api/events";
import { EventList } from "../components/events/EventList";
import { AddEventModal } from "../components/events/AddEventModal";
import { useAuth } from "../contexts/AuthContext";
import type { EventData } from "../types";
import { Button } from "../components/Button";
import { PlusIcon } from "lucide-react";
import { useFetch } from "../hooks/useFetch";

export function EventsPage() {
  const { isAuthenticated } = useAuth();
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const { data, loading, error, refetch } = useFetch<EventData[]>(fetchEvents);
  const events = data ?? [];

  const handleAddEvent = () => {
    refetch();
    setIsAddEventModalOpen(false);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Events</h1>
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <Button
              icon={<PlusIcon className="mr-1 h-4 w-4" />}
              onClick={() => setIsAddEventModalOpen(true)}
            >
              Add Event
            </Button>
          )}
        </div>
      </div>

      <EventList
        loading={loading}
        error={error?.message ?? null}
        events={events}
      />

      {isAddEventModalOpen && isAuthenticated && (
        <AddEventModal
          isOpen={isAddEventModalOpen}
          onClose={() => setIsAddEventModalOpen(false)}
          onAddEvent={handleAddEvent}
        />
      )}
    </>
  );
}
