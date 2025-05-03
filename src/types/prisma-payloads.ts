import { Prisma } from "@prisma/client";

export type PatientProfilePayload = Prisma.PatientProfileGetPayload<{
  include: {
    appointments: { include: { doctor: true } };
  };
}>;
export type DoctorProfilePayload = Prisma.DoctorProfileGetPayload<{
  include: {
    appointments: { include: { patient: true } };
    availability: { include: { exceptions: true } };
  };
}>;
