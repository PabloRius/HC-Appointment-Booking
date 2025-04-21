import prisma from "@/prisma";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const validatedFields = RegisterSchema.safeParse(body);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const formattedErrors = Object.entries(errors).reduce(
      (acc, [key, value]) => {
        acc[key] = value?.[0];
        return acc;
      },
      {} as Record<string, string>
    );

    return NextResponse.json(
      {
        error: "Validation failed",
        errors: formattedErrors,
      },
      { status: 400 }
    );
  }

  const {
    nationalId,
    password,
    name,
    email,
    phone,
    dateOfBirth,
    gender,
    address,
  } = validatedFields.data;
  const existingUser = await prisma.patient.findUnique({
    where: { nationalId },
  });

  if (existingUser) {
    console.error("The national ID already exists");
    return NextResponse.json(
      { error: "National ID already in use" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.patient.create({
      data: {
        nationalId,
        password: hashedPassword,
        name,
        email,
        phone: `${phone.prefix}${phone.number}`,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
