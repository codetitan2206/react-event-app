import type { User } from "../../types";
import { AttendeeHeader } from "../Attendees/AttendeeHeader";
import { AttendeeList } from "../Attendees/AttendeeList";

export function AttendeeSection({
  attendees,
  isOwner,
  setIsAddAttendeeModalOpen,
  handleRemoveAttendee,
}: {
  attendees: User[];
  isOwner: boolean;
  setIsAddAttendeeModalOpen: (isOpen: boolean) => void;
  handleRemoveAttendee: (id: number) => void;
}) {
  return (
    <div>
      <AttendeeHeader
        attendees={attendees}
        isOwner={isOwner}
        setIsAddAttendeeModalOpen={setIsAddAttendeeModalOpen}
      />
      <AttendeeList
        attendees={attendees}
        isOwner={isOwner}
        onRemoveAttendee={handleRemoveAttendee}
      />
    </div>
  );
}
