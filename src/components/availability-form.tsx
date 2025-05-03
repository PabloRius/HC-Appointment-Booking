import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Plus, Trash2 } from "lucide-react";

interface AvailabilityFormProps {
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurrence: string;
  validUntil: string;
  setStartTime: (val: string) => void;
  setEndTime: (val: string) => void;
  setIsRecurring: (val: boolean) => void;
  setRecurrence: (val: string) => void;
  setValidUntil: (val: string) => void;
  handleSubmit: () => void;
  handleDelete: () => void;
  isEditing: boolean;
  setIsDialogOpen: (val: boolean) => void;
}

export function AvailabilityForm({
  startTime,
  endTime,
  isRecurring,
  recurrence,
  validUntil,
  setStartTime,
  setEndTime,
  setIsRecurring,
  setRecurrence,
  setValidUntil,
  handleSubmit,
  handleDelete,
  isEditing,
  setIsDialogOpen,
}: AvailabilityFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <Input
            type="time"
            step="1800"
            value={startTime}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(":").map(Number);
              const newEnd = new Date();
              newEnd.setHours(hours);
              newEnd.setMinutes(minutes + 30);
              setStartTime(e.target.value);
              setEndTime(
                `${String(newEnd.getHours()).padStart(2, "0")}:${String(
                  newEnd.getMinutes()
                ).padStart(2, "0")}`
              );
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <Input type="time" value={endTime} disabled />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="recurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
        />
        <label htmlFor="recurring" className="text-sm font-medium">
          Recurring
        </label>
      </div>

      {isRecurring && (
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium mb-1">Recurrence</label>
            <Select value={recurrence} onValueChange={setRecurrence}>
              <SelectTrigger>
                <SelectValue placeholder="Select recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Valid Until (optional)
            </label>
            <Input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        {isEditing && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="mr-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {isEditing ? (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Update
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
