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

describe("Login API Route", () => {
  let mockPatient1Payload: URLSearchParams;
  let mockDoctor1Payload: URLSearchParams;

  let csrfToken: string;
  let cookie: string;
  beforeAll(async () => {
    await eraseDatabase();
    await fetch("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify(mockPatient1),
    });
    await fetch("http://localhost:3000/api/register/doctor", {
      method: "POST",
      body: JSON.stringify(mockDoctor1),
    });

    const csrfResponse = await fetch("http://localhost:3000/api/auth/csrf");
    const csrfData = await csrfResponse.json();
    csrfToken = csrfData.csrfToken;
    cookie = csrfResponse.headers.get("set-cookie") || "";

    mockPatient1Payload = new URLSearchParams();
    mockPatient1Payload.append("id", mockPatient1.nationalId);
    mockPatient1Payload.append("password", mockPatient1.password);
    mockPatient1Payload.append("csrfToken", csrfToken);
    mockPatient1Payload.append("json", "true");

    mockDoctor1Payload = new URLSearchParams();
    mockDoctor1Payload.append("id", mockDoctor1.Id);
    mockDoctor1Payload.append("password", mockDoctor1.password);
    mockDoctor1Payload.append("csrfToken", csrfToken);
    mockDoctor1Payload.append("json", "true");
  });
  it("should authenticate a patient with valid credentials", async () => {
    const response = await fetch(
      "http://localhost:3000/api/auth/callback/credentials",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: cookie,
        },
        body: mockPatient1Payload.toString(),
        redirect: "manual",
      }
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toContain("/");
    expect(response.headers.get("set-cookie")).toMatch(/authjs.session-token/);
  });
  it("should authenticate with valid credentials", async () => {
    const response = await fetch(
      "http://localhost:3000/api/auth/callback/credentials",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: cookie,
        },
        body: mockDoctor1Payload.toString(),
        redirect: "manual",
      }
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toContain("/");
    expect(response.headers.get("set-cookie")).toMatch(/authjs.session-token/);
  });
  it("should fail with invalid credentials", async () => {
    mockPatient1Payload.set("password", "wrongpassword");
    const response = await fetch(
      "http://localhost:3000/api/auth/callback/credentials",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: cookie,
        },
        body: mockPatient1Payload.toString(),
        redirect: "manual",
      }
    );

    expect(response.status).toBe(302);

    const location = response.headers.get("location");
    expect(location).toContain("error=CredentialsSignin");

    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toBeNull();
  });
});
