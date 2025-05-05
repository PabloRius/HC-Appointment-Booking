"use client";

import {
  ArrowRight,
  Brain,
  Heart,
  Stethoscope,
  SmileIcon as Tooth,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Specialty } from "@/types/prisma-payloads";
import { ElementType } from "react";

// Mock data for appointment types
const appointmentTypes: {
  id: Specialty;
  description: string;
  icon: ElementType;
}[] = [
  {
    id: "General Medicine",
    description: "Regular check-ups, common illnesses, and preventive care",
    icon: Stethoscope,
  },
  {
    id: "Cardiology",
    description:
      "Heart-related issues, blood pressure, and cardiovascular health",
    icon: Heart,
  },
  {
    id: "Neurology",
    description: "Brain and nervous system disorders, headaches, and seizures",
    icon: Brain,
  },
  {
    id: "Orthodontics",
    description: "Dental alignment, braces, and oral health",
    icon: Tooth,
  },
];

export function AppointmentTypeSelector({
  appointmentType,
  setAppointmentType,
  nextStep,
}: {
  appointmentType: string | null;
  setAppointmentType: (appointmentType: string) => void;
  nextStep: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Select Appointment Type</h2>
        <p className="text-muted-foreground mb-6">
          Choose the type of medical service you need. This helps us match you
          with the right specialist.
        </p>
      </div>

      <RadioGroup
        value={appointmentType || ""}
        onValueChange={setAppointmentType}
        className="grid gap-4"
      >
        {appointmentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div key={type.id} className="relative">
              <RadioGroupItem
                value={type.id}
                id={type.id}
                className="peer sr-only"
                aria-label={type.id}
              />
              <Label
                htmlFor={type.id}
                className="flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50 peer-data-[state=checked]:border-teal-600 peer-data-[state=checked]:bg-teal-50 [&:has([data-state=checked])]:border-teal-600 [&:has([data-state=checked])]:bg-teal-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
                  <Icon className="h-5 w-5 text-teal-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium leading-none">{type.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      <div className="flex justify-end">
        <Button
          onClick={nextStep}
          disabled={!appointmentType}
          className="bg-teal-600 hover:bg-teal-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
