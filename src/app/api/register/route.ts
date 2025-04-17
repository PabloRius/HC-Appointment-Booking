import prisma from "@/prisma";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const validatedFields = RegisterSchema.safeParse(body);

  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
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
    where: { nationalId },
  });

  if (existingUser) {
    console.error("The user already exists");
    return NextResponse.json(
      { error: "National ID already in use" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        nationalId,
        password: hashedPassword,
        name,
        email,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address,
      },
    });
    return NextResponse.json(user);
  } catch (err) {
    console.error(`Error creating the profile: ${err}`);
    return NextResponse.json(
      { error: `Error creating the profile: ${err}` },
      { status: 400 }
    );
  }
}
