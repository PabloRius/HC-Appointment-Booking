import { Check } from "lucide-react";

export function AppointmentSteps({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: "Appointment Type" },
    { number: 2, label: "Date & Time" },
    { number: 3, label: "Select Doctor" },
    { number: 4, label: "Confirm" },
  ];

  return (
    <div className="relative">
      <div
        className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"
        aria-hidden="true"
      />
      <nav className="relative flex justify-between" aria-label="Progress">
        {steps.map((step) => (
          <div key={step.number} className={`flex flex-col items-center`}>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                step.number < currentStep
                  ? "border-teal-600 bg-teal-600"
                  : step.number === currentStep
                  ? "border-teal-600 bg-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              {step.number < currentStep ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <span
                  className={`text-sm font-medium ${
                    step.number === currentStep
                      ? "text-teal-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.number}
                </span>
              )}
            </div>
            <div
              className={`mt-2 text-xs ${
                step.number <= currentStep
                  ? "font-medium text-teal-600"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
