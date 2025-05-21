import prisma from "@/utils/db";
import AdminHome from "./_components/AdminHome";

async function getDashboardStats() {
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

  return {
    totalUsers,
    totalFlights,
    totalBookings,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    activeBookings,
  };
}

export default async function AdminDashboardHome() {
  const dashboardData = await getDashboardStats();

  return <AdminHome initialData={dashboardData} />;
}
