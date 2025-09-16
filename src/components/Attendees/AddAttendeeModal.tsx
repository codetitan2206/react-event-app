import { useState } from "react";
import { XIcon } from "lucide-react";
import type { User } from "../../types";
import { LoadingMessage } from "../LoadingMessage";
import { Button } from "../Button";
import { SearchBar } from "../SearchBar";
import { AttendeeList } from "./AttendeeList";

interface AddAttendeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  existingAttendees: User[];
  users: User[];
  isLoading: boolean;
  onAdd: (userId: number) => Promise<void>;
}

export function AddAttendeeModal({
  isOpen,
  onClose,
  existingAttendees,
  users,
  isLoading,
  onAdd,
}: AddAttendeeModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const availableUsers = users.filter(
    (user) => !existingAttendees.some((attendee) => attendee.id === user.id)
  );

  const filteredUsers =
    searchTerm.trim() === ""
      ? availableUsers
      : availableUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const handleAddAttendee = async (userToAdd: User) => {
    try {
      setIsAdding(true);
      await onAdd(userToAdd.id);
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setSelectedUser(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-full max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-lg bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Attendee</h2>
          <Button size="small" variant="secondary" onClick={onClose}>
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex-1 overflow-y-auto p-1">
          {isLoading ? (
            <LoadingMessage message="Loading..." />
          ) : (
            <AttendeeList
              attendees={filteredUsers}
              mode="selection"
              selectedAttendee={selectedUser}
              onAttendeeSelect={setSelectedUser}
            />
          )}
        </div>

        <div className="flex justify-end space-x-2 border-t border-gray-200 p-4">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={() => selectedUser && handleAddAttendee(selectedUser)}
            disabled={!selectedUser || isAdding}
          >
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
}
