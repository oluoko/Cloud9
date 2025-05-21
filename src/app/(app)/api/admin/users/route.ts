import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all users with a count of their bookings
    const users = await prisma.user.findMany({
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        phoneNumber: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to include the booking count
    const formattedUsers = users.map((user) => ({
      id: user.id,
      clerkUserId: user.clerkUserId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      phoneNumber: user.phoneNumber,
      bookingsCount: user._count.bookings,
      createdAt: user.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
