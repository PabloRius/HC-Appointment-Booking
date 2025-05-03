"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DoctorAvailability } from "@prisma/client";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AvailabilityForm } from "./availability-form";

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
  const [dayAvailabilities, setDayAvailabilities] = useState<
    DoctorAvailability[]
  >([]);
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
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    const dayAvailabilities = availability.filter((avail) => {
      return !avail.isRecurring && isSameDay(avail.validFrom, day);
    });
    setDayAvailabilities(dayAvailabilities);
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
      ? `/api/availability/${currentAvailability!.id}`
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
              </div>

              <div className="mt-1 space-y-1">
                {dayAvailabilities.length > 0 && (
                  <span className="text-xs text-teal-600">
                    {dayAvailabilities.length} slot
                    {dayAvailabilities.length !== 1 ? "s" : ""}
                  </span>
                )}
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
              {isEditing ? "Edit Availability" : "Manage Availabilities"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {dayAvailabilities.length > 0 && !isEditing ? (
              <div>
                <ul className="space-y-2">
                  {dayAvailabilities.map((avail) => (
                    <li
                      key={avail.id}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {`${String(avail.startHour).padStart(2, "0")}:${String(
                          avail.startMinute
                        ).padStart(2, "0")} - ${String(avail.endHour).padStart(
                          2,
                          "0"
                        )}:${String(avail.endMinute).padStart(2, "0")}`}
                      </span>
                      <div className="space-x-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleAvailabilityClick(avail, selectedDate!)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          // onClick={() => handleDeleteAvailability(avail.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentAvailability(null);
                    }}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Availability
                  </Button>
                </div>
              </div>
            ) : (
              // Existing form for adding or editing availability
              <AvailabilityForm
                startTime={startTime}
                endTime={endTime}
                isRecurring={isRecurring}
                recurrence={recurrence}
                validUntil={validUntil}
                setStartTime={setStartTime}
                setEndTime={setEndTime}
                setIsRecurring={setIsRecurring}
                setRecurrence={setRecurrence}
                setValidUntil={setValidUntil}
                handleSubmit={handleSubmit}
                handleDelete={handleDelete}
                isEditing={isEditing}
                setIsDialogOpen={setIsDialogOpen}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
