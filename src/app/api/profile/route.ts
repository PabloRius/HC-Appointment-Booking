import { auth } from "@/auth";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = session.user;

  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: profileId, role } = user;
  const now = new Date();
  if (role === "patient") {
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: profileId },
      include: {
        appointments: {
          include: { doctor: true },
          where: { startTime: { gte: now } },
        },
      },
    });

    if (!patientProfile) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ...patientProfile, role: "patient" });
  }

  if (role === "doctor") {
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: profileId },
      include: {
        appointments: {
          where: { startTime: { gte: now } },
          include: { patient: true },
        },
      },
    });

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ...doctorProfile, role: "doctor" });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
