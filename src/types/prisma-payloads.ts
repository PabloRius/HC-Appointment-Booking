import { Prisma } from "@prisma/client";

export type PatientProfilePayload = Prisma.PatientProfileGetPayload<{
  include: {
    appointments: { include: { timeslot: { include: { doctor: true } } } };
  };
}>;
export type DoctorProfilePayload = Prisma.DoctorProfileGetPayload<{
  include: {
    timeslots: {
      include: { appointment: { include: { patient: true; timeslot: true } } };
    };
  };
}>;
