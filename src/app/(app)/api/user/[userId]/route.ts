import { NextRequest, NextResponse } from "next/server";


export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch user's bookings with flight details
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId
      },
      include: {
        Flight: {
          select: {
            flightName: true,
            departureAirport: true,
            arrivalAirport: true,
            flightDate: true,
            flightTime: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format bookings to include flight details
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      paymentReference: booking.paymentReference,
      paymentMethod: booking.paymentMethod,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      seatType: booking.seatType,
      seatCount: booking.seatCount,
      flightId: booking.flightId,
      createdAt: booking.createdAt.toISOString(),
      flight: booking.Flight
    }));

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        clerkUserId: user.clerkUserId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      },
      bookings: formattedBookings
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user details" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
