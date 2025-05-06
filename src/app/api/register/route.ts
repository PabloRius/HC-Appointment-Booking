import prisma from "@/prisma";
import { RegisterSchema } from "@/schemas";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
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

    const existingUser = await prisma.user.findUnique({
      where: { loginId: nationalId },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "National ID is already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        loginId: nationalId,
        password: hashedPassword,
        role: "patient",
      },
    });

    const newProfile = await prisma.patientProfile.create({
      data: {
        userId: newUser.id,
        name,
        email,
        phone: `${phone.prefix}${phone.number}`,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address,
      },
    });

    return NextResponse.json({ ...newProfile }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "National ID is required to identify the patient" },
        { status: 400 }
      );
    }
    console.log(id);
    const profile = await prisma.patientProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const dataToUpdate: Prisma.PatientProfileUpdateInput = { ...updateData };

    // Update the patient profile
    const updatedProfile = await prisma.patientProfile.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ ...updatedProfile }, { status: 200 });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
