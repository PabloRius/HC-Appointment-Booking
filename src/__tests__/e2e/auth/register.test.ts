/**
 * @jest-environment node
 */
import { eraseDatabase } from "@/lib/eraseDatabase";

const mockPatient1 = {
  nationalId: "12345678Z",
  password: "saf3Passw0rd_",
  name: "Pablo Garcia Rius",
  email: "pablogrius@gmail.com",
  phone: { prefix: "+34", number: "123456789" },
  dateOfBirth: new Date("2001-10-06"),
  gender: "male",
};
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

describe("Register API Route", () => {
  beforeEach(async () => {
    await eraseDatabase();
  });
  it("should create a patient profile successfully and return 201", async () => {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify(mockPatient1),
    });
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.id).toEqual(expect.any(String));
    expect(body.name).toBe(mockPatient1.name);
  });
  it("should fail when sending a duplicated National Id and return 409", async () => {
    await fetch("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify(mockPatient1),
    });
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify(mockPatient1),
    });
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toEqual("National ID is already registered");
  });
  it("should create a doctor profile successfully and return 201", async () => {
    const response = await fetch("http://localhost:3000/api/register/doctor", {
      method: "POST",
      body: JSON.stringify(mockDoctor1),
    });
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.id).toEqual(expect.any(String));
    expect(body.name).toBe(mockDoctor1.name);
  });
  it("should fail when sending a dulpicated Id return 409", async () => {
    await fetch("http://localhost:3000/api/register/doctor", {
      method: "POST",
      body: JSON.stringify(mockDoctor1),
    });
    const response = await fetch("http://localhost:3000/api/register/doctor", {
      method: "POST",
      body: JSON.stringify(mockDoctor1),
    });
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toEqual("ID is already registered");
  });
});
