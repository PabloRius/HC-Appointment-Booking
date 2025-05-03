"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoctorAvailability } from "@prisma/client";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DoctorAvailabilityCalendar({ doctorId }: { doctorId: string }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAvailability, setCurrentAvailability] =
    useState<DoctorAvailability | null>(null);

  // Form state
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState("weekly");
  const [validUntil, setValidUntil] = useState("");

  // Fetch availability data
  useEffect(() => {
    const fetchAvailability = async () => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(addMonths(currentMonth, 1)); // Next month for overflow days

      const res = await fetch(
        `/api/availability?doctorId=${doctorId}&start=${start.toISOString()}&end=${end.toISOString()}`
      );
      const data = await res.json();
      console.log(data);
      setAvailability(data);
    };

    fetchAvailability();
  }, [doctorId, currentMonth]);

  // Calendar rendering
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setIsDialogOpen(true);
    setIsEditing(false);
    setCurrentAvailability(null);
  };

  const handleAvailabilityClick = (avail: DoctorAvailability, day: Date) => {
    setSelectedDate(day);
    setCurrentAvailability(avail);
    setIsEditing(true);
    setIsDialogOpen(true);

    // Pre-fill form with existing data
    setStartTime(`${avail.startHour}:${avail.startMinute}`);
    setEndTime(`${avail.endHour}:${avail.endMinute}`);
    setIsRecurring(avail.isRecurring);
    setRecurrence(avail.recurrence || "weekly");
    setValidUntil(avail.validUntil?.toISOString() || "");
  };

  const handleSubmit = async () => {
    if (!currentAvailability) return;
    const payload = {
      doctorId,
      dayOfWeek: selectedDate?.getDay(),
      startTime: `${format(selectedDate!, "yyyy-MM-dd")}T${startTime}:00`,
      endTime: `${format(selectedDate!, "yyyy-MM-dd")}T${endTime}:00`,
      isRecurring,
      recurrence: isRecurring ? recurrence : null,
      validFrom: format(selectedDate!, "yyyy-MM-dd"),
      validUntil: validUntil || null,
    };

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `/api/availability/${currentAvailability.id}`
      : "/api/availability";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setIsDialogOpen(false);
      // Refresh data
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(addMonths(currentMonth, 1));
      const refreshRes = await fetch(
        `/api/availability?doctorId=${doctorId}&start=${start.toISOString()}&end=${end.toISOString()}`
      );
      setAvailability(await refreshRes.json());
    }
  };

  const handleDelete = async () => {
    if (!currentAvailability) return;

    const res = await fetch(`/api/availability/${currentAvailability.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setIsDialogOpen(false);
      // Refresh data
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(addMonths(currentMonth, 1));
      const refreshRes = await fetch(
        `/api/availability?doctorId=${doctorId}&start=${start.toISOString()}&end=${end.toISOString()}`
      );
      setAvailability(await refreshRes.json());
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{`Manage Availability (${
          months[currentMonth.getMonth()]
        })`}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-medium text-sm py-2">
            {day.slice(0, 3)}
          </div>
        ))}

        {calendarDays.map((day) => {
          const dayAvailabilities = availability.filter((avail) => {
            if (avail.isRecurring) {
              return false;
            } else {
              console.log(avail.validFrom, day);
              if (isSameDay(avail.validFrom, day)) {
                return true;
              }
            }
          });

          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`min-h-24 p-2 border rounded-md ${
                isSameMonth(day, currentMonth)
                  ? "bg-white"
                  : "bg-gray-50 text-gray-400"
              } ${
                isSameDay(day, new Date()) ? "border-teal-500 border-2" : ""
              }`}
            >
              <div className="flex justify-between">
                <span className="text-sm font-medium">{format(day, "d")}</span>
                {dayAvailabilities.length > 0 && (
                  <span className="text-xs text-teal-600">
                    {dayAvailabilities.length} slot
                    {dayAvailabilities.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="mt-1 space-y-1">
                {dayAvailabilities.map((avail) => (
                  <div
                    key={avail.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAvailabilityClick(avail, day);
                    }}
                    className="text-xs p-1 bg-teal-100 text-teal-800 rounded cursor-pointer hover:bg-teal-200"
                  >
                    {`${avail.startHour}:${avail.startMinute}`} -{" "}
                    {`${avail.endHour}:${avail.endMinute}`}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Availability Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Availability" : "Add New Availability"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input
                type="date"
                value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                disabled
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
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
                  <label className="block text-sm font-medium mb-1">
                    Recurrence
                  </label>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
