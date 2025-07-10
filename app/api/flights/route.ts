import prisma from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const flights = await prisma.flight.findMany();
    return NextResponse.json(flights);
  } catch (error) {
    console.error("Error fetching flights:", error);
    return NextResponse.error();
  }
}
