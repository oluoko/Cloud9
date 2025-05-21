import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Calculate all stats in parallel for better performance
    const [
      totalUsers,
      totalFlights,
      totalBookings,
      totalRevenue,
      activeBookings,
    ] = await Promise.all([
      // Count total users
      prisma.user.count(),

      // Count total flights
      prisma.flight.count(),

      // Count total bookings
      prisma.booking.count(),

      // Calculate total revenue
      prisma.booking.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          paymentStatus: "paid",
        },
      }),

      // Count confirmed bookings
      prisma.booking.count({
        where: {
          bookingStatus: "confirmed",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      totalUsers,
      totalFlights,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      activeBookings,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
