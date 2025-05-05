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

describe("Doctor Availability API", () => {
  let mockDoctor1Id: string;

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
  });
  beforeEach(async () => {
    await prisma.doctorAvailability.deleteMany();
  });

  it("should fetch availability for a doctor (empty)", async () => {
    const today = new Date();
    const response = await fetch(
      `http://localhost:3000/api/availability?doctorId=${mockDoctor1Id}&start=${today}`
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  it("should create a new slot for a doctor", async () => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const newSlotPayload = {
      doctorId: mockDoctor1Id,
      dayOfWeek: tomorrow.getDay(),
      startTime: new Date(tomorrow.setHours(9, 30)),
      endTime: new Date(tomorrow.setHours(10, 0)),
      isRecurring: false,
      validFrom: tomorrow,
      validUntil: null,
    };
    const response = await fetch("http://localhost:3000/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSlotPayload),
    });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(new Date(data.validFrom).toISOString()).toBe(tomorrow.toISOString());
    expect(data.startHour).toBe(9);
    expect(data.startMinute).toBe(30);
  });

  it("should modify an existing slot for a doctor", async () => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const newSlotPayload = {
      doctorId: mockDoctor1Id,
      dayOfWeek: tomorrow.getDay(),
      startTime: new Date(tomorrow.setHours(9, 30)),
      endTime: new Date(tomorrow.setHours(10, 0)),
      isRecurring: false,
      validFrom: tomorrow,
      validUntil: null,
    };
    const createResponse = await fetch(
      "http://localhost:3000/api/availability",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlotPayload),
      }
    );
    const newSlot = await createResponse.json();
    const editedSlotPayload = {
      ...newSlot,
      startTime: new Date(tomorrow.setHours(10, 30)),
      endTime: new Date(tomorrow.setHours(11, 0)),
    };
    const response = await fetch("http://localhost:3000/api/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedSlotPayload),
    });
    const editedSlot = await response.json();

    expect(response.status).toBe(201);
    expect(new Date(editedSlot.validFrom).toISOString().split("T")[0]).toBe(
      tomorrow.toISOString().split("T")[0]
    );
    expect(editedSlot.startHour).toBe(10);
    expect(editedSlot.startMinute).toBe(30);
  });

  it("should delete an existing slot for a doctor", async () => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const newSlotPayload = {
      doctorId: mockDoctor1Id,
      dayOfWeek: tomorrow.getDay(),
      startTime: new Date(tomorrow.setHours(9, 30)),
      endTime: new Date(tomorrow.setHours(10, 0)),
      isRecurring: false,
      validFrom: tomorrow,
      validUntil: null,
    };
    const createResponse = await fetch(
      "http://localhost:3000/api/availability",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlotPayload),
      }
    );
    const newSlot = await createResponse.json();

    const deleteResponse = await fetch(
      `http://localhost:3000/api/availability?id=${newSlot.id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    expect(deleteResponse.status).toBe(200);
    const getResponse = await fetch(
      `http://localhost:3000/api/availability?doctorId=${mockDoctor1Id}&start=${today}`
    );
    const data = await getResponse.json();
    console.log(data);
    expect(getResponse.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });
});
