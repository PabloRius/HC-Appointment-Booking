import prisma from "@/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, oldPassword, newPassword } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required to identify the patient" },
        { status: 400 }
      );
    }
    const profile = await prisma.patientProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    const user = await prisma.user.findUnique({
      where: { id: profile.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const passwordsMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordsMatch)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 409 }
      );

    const updatedProfile = await prisma.user.update({
      where: { id: user.id },
      data: { password: newPassword },
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
