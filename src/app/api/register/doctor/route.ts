import prisma from "@/prisma";
import { DoctorRegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedFields = DoctorRegisterSchema.safeParse(body);

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

    const { Id, password, name, email, phone, gender } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
      where: { loginId: Id },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "National ID is already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        loginId: Id,
        password: hashedPassword,
        role: "doctor",
      },
    });

    await prisma.doctorProfile.create({
      data: {
        userId: newUser.id,
        name,
        email,
        phone: `${phone.prefix}${phone.number}`,
        gender,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
