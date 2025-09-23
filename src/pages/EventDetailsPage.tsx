import { useCallback } from "react";
import {
  fetchEventAttendees,
  removeAttendeeFromEvent,
  addAttendeeToEvent,
} from "../api/attendees";
import { deleteEvent, fetchEventById } from "../api/events";
import { fetchUsers } from "../api/users";
import { useAuth } from "../contexts/AuthContext";
import type { EventData, User } from "../types";
import { useParams, useNavigate } from "react-router-dom";
import { AddAttendeeModal } from "../components/Attendees/AddAttendeeModal";
import { CalendarIcon, MapPinIcon, PencilIcon, TrashIcon } from "lucide-react";
import { formatDate } from "../utils/dateUtils";
import { LoadingMessage } from "../components/LoadingMessage";
import { AttendeeSection } from "../components/Attendees/AttendeeSection";
import { Button } from "../components/Button";
import { useFetch } from "../hooks/useFetch";
import { useState } from "react";
import { ErrorMessage } from "../components/ErrorMessage";
import { useAsync } from "../hooks/useAsync";

import { ConfirmModal } from "../components/ConfirmModal";

export function EventDetailsPage() {
  const { auth } = useAuth();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isAddAttendeeModalOpen, setIsAddAttendeeModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);

  const getEvent = useCallback(
    () => fetchEventById(Number(eventId)),
    [eventId]
  );

  const getAttendees = useCallback(
    () => fetchEventAttendees(Number(eventId)),
    [eventId]
  );

  const {
    data: currentEvent,
    loading: eventLoading,
    error: eventError,
  } = useFetch<EventData>(getEvent);

  const {
    data: attendees,
    refetch: refetchAttendees,
    error: attendeesError,
  } = useFetch<User[]>(getAttendees);

  const getUsersIfAuthenticated = useCallback(
    () => (auth ? fetchUsers() : Promise.resolve([])),
    [auth]
  );

  const {
    data: users,
    loading: usersLoading,
    error: usersError,
  } = useFetch<User[]>(getUsersIfAuthenticated);

  const { run: deleteEventAction, error: deleteEventError } = useAsync({
    action: deleteEvent,
    onSuccess: () => navigate("/events"),
    errorMessage: "Failed to delete event",
  });

  const { run: removeAttendeeAction, error: removeError } = useAsync({
    action: removeAttendeeFromEvent,
    onSuccess: refetchAttendees,
    errorMessage: "Failed to remove attendee",
  });

  const { run: addAttendeeAction, error: addError } = useAsync({
    action: addAttendeeToEvent,
    onSuccess: refetchAttendees,
    errorMessage: "Failed to add attendee",
  });

  const error =
    eventError ||
    attendeesError ||
    usersError ||
    removeError ||
    addError ||
    deleteEventError;

  if (eventLoading) {
    return <LoadingMessage message="Loading..." />;
  }

  //console.log("Auth userId:", auth?.userId);
  //console.log("Event ownerId:", currentEvent?.ownerId);

  const currentAttendees = attendees || [];

  return (
    <div className="mx-auto my-8 flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-lg ">
      {error && <ErrorMessage error={error} />}
      <div className="flex flex-col gap-4 border-b border-gray-200 p-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="max-w-xl break-words text-xl font-semibold text-gray-800">
            {currentEvent?.name}
          </h2>
          <p className="mt-1 max-w-xl whitespace-pre-wrap break-words text-gray-600">
            {currentEvent?.description}
          </p>
        </div>
        {auth?.userId === currentEvent?.ownerId && (
          <div className="flex gap-2 md:mb-0 md:flex-shrink-0">
            <Button
              size="small"
              variant="secondary"
              icon={<TrashIcon className="h-4 w-4" />}
              onClick={() => setIsDeleteConfirmModalOpen(true)}
            >
              Delete
            </Button>
            <Button
              size="small"
              variant="secondary"
              icon={<PencilIcon className="h-4 w-4" />}
              onClick={() => navigate(`/events/${eventId}/edit`)}
            >
              Edit
            </Button>
          </div>
        )}
      </div>

      <div className="min-h-[400px] flex-1 p-6">
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-medium text-gray-800">
            Event Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="mr-3 h-5 w-5" />
              <span>{formatDate(currentEvent?.date || "")}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="mr-3 h-5 w-5" />
              <span>{currentEvent?.location}</span>
            </div>
          </div>
        </div>

        <AttendeeSection
          attendees={currentAttendees}
          isOwner={auth?.userId === currentEvent?.ownerId}
          setIsAddAttendeeModalOpen={setIsAddAttendeeModalOpen}
          handleRemoveAttendee={(attendeeId) =>
            removeAttendeeAction(attendeeId, Number(eventId))
          }
        />
      </div>

      <AddAttendeeModal
        isOpen={isAddAttendeeModalOpen}
        isLoading={usersLoading}
        eventId={currentEvent?.id || 0}
        existingAttendees={currentAttendees}
        users={users || []}
        onClose={() => setIsAddAttendeeModalOpen(false)}
        onAdd={(userId) => addAttendeeAction(Number(eventId), userId)}
      />

      <ConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        title="Delete Event"
        description={`Are you sure you want to delete "${currentEvent?.name}"?`}
        confirmButtonText="Delete"
        onConfirm={() => deleteEventAction(Number(eventId))}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
      />
    </div>
  );
}
