import { Card } from "@/components/ui/card";
import { getUsers } from "@/lib/auth";
import { defaultProfileImage, formatDate, getFirstWords } from "@/lib/utils";
import prisma from "@/utils/db";
import {
  Calendar,
  DollarSign,
  Plane,
  Star,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import UserRoleDistribution from "./_components/user-role-distribution";
import { StarRating } from "@/components/testimonials";
import Link from "next/link";

export default async function AdminDashboardHome() {
  const users = await prisma.user.findMany({
    include: {
      bookings: true,
      testimonial: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allBookings = await prisma.booking.findMany({
    include: {
      User: true,
    },
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });

  const allTestimonials = await prisma.testimonial.findMany({
    include: {
      user: true,
    },
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });

  const flights = await prisma.flight.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const banners = await prisma.banner.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const userRoleData = users.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const pieChartData = Object.entries(userRoleData).map(([role, count]) => ({
    name: role,
    value: count,
  }));

  const seatTypeData = allBookings.reduce(
    (acc, booking) => {
      acc[booking.seatType] = (acc[booking.seatType] || 0) + booking.seatCount;
      return acc;
    },
    {} as Record<string, number>
  );

  const seatTypeChartData = Object.entries(seatTypeData).map(
    ([type, count]) => ({
      name: type,
      value: count,
    })
  );

  const monthlyBookings = allBookings.reduce(
    (acc, booking) => {
      const month = new Date(booking.createdAt).toLocaleString("default", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const lineChartData = Object.entries(monthlyBookings).map(
    ([month, count]) => ({
      month,
      bookings: count,
    })
  );

  const revenueData = allBookings.reduce(
    (acc, booking) => {
      if (booking.paymentStatus === "completed") {
        const month = new Date(booking.createdAt).toLocaleString("default", {
          month: "short",
        });
        acc[month] = (acc[month] || 0) + booking.totalAmount;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const revenueChartData = Object.entries(revenueData).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );

  const combinedRevenueData = Object.entries(revenueData).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );

  // Combined booking and revenue trend data
  const combinedTrendData = Object.keys({
    ...monthlyBookings,
    ...revenueData,
  }).map((month) => ({
    month,
  }));

  const totalRevenue = allBookings.reduce((sum, booking) => {
    return (
      sum + (booking.paymentStatus === "completed" ? booking.totalAmount : 0)
    );
  }, 0);

  const averageRating =
    allTestimonials.reduce(
      (sum, testimonial) => sum + (testimonial.rating || 0),
      0
    ) / allTestimonials.length;

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="p-1 md:p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-muted-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-accent-foreground">
          Welcome back! Here&apos;s what&apos;s been happening with Cloud9.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-6">
          <Card>
            <div className="flex items-center justify-between px-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-accent-foreground">
                  {users.length}
                </p>
              </div>
              <div className="p-3 bg-blue-600/20 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between px-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold text-accent-foreground">
                  {allBookings.length}
                </p>
              </div>
              <div className="p-3 bg-cyan-600/20 rounded-full">
                <Calendar className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between px-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-accent-foreground">
                  {totalRevenue}
                </p>
              </div>
              <div className="p-3 bg-green-600/20 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between px-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Rating
                </p>
                <p className="text-2xl font-bold text-accent-foreground">
                  {averageRating}
                </p>
              </div>
              <div className="p-3 bg-yellow-600/20 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between px-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Flights
                </p>
                <p className="text-2xl font-bold text-accent-foreground">
                  {flights.length}
                </p>
              </div>
              <div className="p-3 bg-purple-600/20 rounded-full">
                <Plane className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between px-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Banners
                </p>
                <p className="text-2xl font-bold text-accent-foreground">
                  {banners.length}
                </p>
              </div>
              <div className="p-3 bg-orange-600/20 rounded-full">
                <ImageIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>
        <Card>
          <div className="px-6">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4 flex justify-between">
              <span>Recent Bookings</span>
              <span>
                Total: <span className="font-black">{allBookings.length}</span>
              </span>
            </h3>
            <div className="space-y-4">
              {allBookings.length > 0 ? (
                allBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border-b last:border-0  bg-transparent hover:bg-accent/70 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-x-2">
                      <Image
                        src={
                          booking.User?.profileImage || defaultProfileImage()
                        }
                        alt="User profile"
                        width={40}
                        height={40}
                        className="rounded-full size-[40px] md:size-[60px] border border-muted-foreground/40 hover:border-primary/60"
                      />
                      <div>
                        <p className="text-muted-foreground">
                          {booking.User?.firstName} {booking.User?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.User?.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">
                        {booking.totalAmount}{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            booking.paymentStatus === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </span>
                      <span className="text-sm text-accent-foreground">
                        {formatDate(booking.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No bookings found.</p>
              )}
            </div>
          </div>
        </Card>
        <UserRoleDistribution pieChartData={pieChartData} COLORS={COLORS} />
        <Card>
          <div className="px-6">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4 flex justify-between">
              <span>Recent Testimonials</span>
              <span>
                Total:{" "}
                <span className="font-black">{allTestimonials.length}</span>
              </span>
            </h3>
            <div className="space-y-4">
              {allTestimonials.length > 0 ? (
                allTestimonials.map((testimonial) => (
                  <Link
                    key={testimonial.id}
                    href={`/admin/testimonials/${testimonial.id}`}
                  >
                    <div className="border-l-4 border-primary pl-2 flex items-center justify-between p-2 md:p-4 border-b last:border-b-0 bg-transparent hover:bg-accent/70 transition-colors">
                      <div className="flex items-center gap-x-2">
                        <Image
                          src={
                            testimonial.user.profileImage ||
                            defaultProfileImage()
                          }
                          alt="User profile"
                          width={40}
                          height={40}
                          className="rounded-full size-[40px] md:size-[60px] border border-muted-foreground/40 hover:border-primary/60"
                        />
                        <div>
                          <p>
                            {testimonial.user.firstName}{" "}
                            {testimonial.user.lastName}
                          </p>
                          <p className="font-medium text-muted-foreground">
                            {getFirstWords(testimonial.comment, 4)}...
                          </p>
                        </div>
                      </div>
                      <div>
                        <StarRating rating={testimonial.rating ?? 0} />

                        <span className="text-sm text-muted-foreground">
                          {formatDate(testimonial.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground">No testimonials found.</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
