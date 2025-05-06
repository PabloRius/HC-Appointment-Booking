/**
 * @jest-environment node
 */
import { eraseDatabase } from "@/lib/eraseDatabase";
import prisma from "@/prisma";
import { addDays } from "date-fns";

const mockDoctor1 = {
  Id: "123456789",
  password: "saf3Passw0rd_",
  name: "Harry Potter",
  email: "hp@gmail.com",
  phone: { prefix: "+34", number: "123456789" },
  dateOfBirth: new Date("2001-10-06"),
  gender: "male",
  specialty: "Cardiology",
};
const mockPatient1 = {
  nationalId: "12345678Z",
  password: "saf3Passw0rd_",
  name: "Pablo Garcia Rius",
  email: "pablogrius@gmail.com",
  phone: { prefix: "+34", number: "123456789" },
  dateOfBirth: new Date("2001-10-06"),
  gender: "male",
};

describe("Appointments API", () => {
  let mockDoctor1Id: string;
  let mockPatient1Id: string;

  beforeAll(async () => {
    await eraseDatabase();

    const testDoctorResponse = await fetch(
      "http://localhost:3000/api/register/doctor",
      {
        method: "POST",
        body: JSON.stringify(mockDoctor1),
      }
    );
    const testDoctor = await testDoctorResponse.json();
    mockDoctor1Id = testDoctor.id;
    const testPatientResponse = await fetch(
      "http://localhost:3000/api/register",
      {
        method: "POST",
        body: JSON.stringify(mockPatient1),
      }
    );
    const testPatient = await testPatientResponse.json();
    mockPatient1Id = testPatient.id;
  });
  beforeEach(async () => {
    await prisma.appointment.deleteMany();
  });

  it("should create a new availability", async () => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const appStart = tomorrow;
    appStart.setHours(9, 30);
    const appEnd = tomorrow;
    appEnd.setHours(10, 0);
    const mockAppointment = {
      notes: "",
      startTime: appStart,
      endTime: appEnd,
      doctorId: mockDoctor1Id,
      patientId: mockPatient1Id,
    };
    const response = await fetch(`http://localhost:3000/api/appointment`, {
      method: "POST",
      body: JSON.stringify(mockAppointment),
    });

    expect(response.status).toBe(201);
  });

  it("should delete a existing availability", async () => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const appStart = tomorrow;
    appStart.setHours(9, 30);
    const appEnd = tomorrow;
    appEnd.setHours(10, 0);
    const mockAppointment = {
      notes: "",
      startTime: appStart,
      endTime: appEnd,
      doctorId: mockDoctor1Id,
      patientId: mockPatient1Id,
    };
    const response = await fetch(`http://localhost:3000/api/appointment`, {
      method: "POST",
      body: JSON.stringify(mockAppointment),
    });
    const data = await response.json();

    const deleteResponse = await fetch(
      `http://localhost:3000/api/appointment?id=${data.id}`,
      { method: "DELETE" }
    );
    expect(deleteResponse.status).toBe(200);
  });
});
