import prisma from "@/utils/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clerk = await clerkClient();

    await prisma.user.delete({
      where: { id: userId },
    });

    await clerk.users.deleteUser(userId);
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
