import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const allDoctors = await prisma.doctorProfile.findMany();

  return NextResponse.json(allDoctors);
}
