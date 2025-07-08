import { Card } from "@/components/ui/card";
import {
  capitalize,
  defaultProfileImage,
  formatDate,
  getFirstWords,
} from "@/lib/utils";
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
import { ErrorImage } from "@/components/error-image";
import SeatTypeGraph from "./_components/seat-type-graph";
import TrendGraph from "./_components/trend-graph";

const MetricCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
  iconColor,
  href,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  iconColor: string;
  href: string;
}) => (
  <Link href={href}>
    <Card>
      <div className="flex items-center justify-between px-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-accent-foreground">{value}</p>
        </div>
        <div className={`p-3 ${bgColor} rounded-full`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  </Link>
);

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
    orderBy: {
      createdAt: "desc",
    },
  });

  const allTestimonials = await prisma.testimonial.findMany({
    include: {
      user: true,
    },
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

  const totalRevenue = allBookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0
  );

  const averageRating =
    allTestimonials.reduce(
      (sum, testimonial) => sum + (testimonial.rating || 0),
      0
    ) / allTestimonials.length;

  const trendData = (() => {
    const monthlyData: Record<string, { bookings: number; revenue: number }> =
      {};

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      monthlyData[monthKey] = { bookings: 0, revenue: 0 };
    }

    // Aggregate booking data by month
    allBookings.forEach((booking) => {
      const monthKey = booking.createdAt.toISOString().slice(0, 7);
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].bookings += 1;
        monthlyData[monthKey].revenue += booking.totalAmount;
      }
    });

    // Convert to chart format
    return Object.entries(monthlyData).map(([monthKey, data]) => {
      const date = new Date(monthKey + "-01");
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      return {
        month: monthName,
        bookings: data.bookings,
        revenue: data.revenue,
      };
    });
  })();

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const metricsData = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      bgColor: "bg-blue-600/20",
      iconColor: "text-blue-600",
      href: "/admin/users",
    },
    {
      title: "Total Bookings",
      value: allBookings.length,
      icon: Calendar,
      bgColor: "bg-cyan-600/20",
      iconColor: "text-cyan-600",
      href: "/admin/bookings",
    },
    {
      title: "Total Revenue",
      value: `Ksh ${totalRevenue}`,
      icon: DollarSign,
      bgColor: "bg-green-600/20",
      iconColor: "text-green-600",
      href: "/admin/bookings",
    },
    {
      title: "Avg Rating",
      value: `${averageRating} Stars`,
      icon: Star,
      bgColor: "bg-yellow-600/20",
      iconColor: "text-yellow-600",
      href: "/admin/testimonials",
    },
    {
      title: "Total Flights",
      value: flights.length,
      icon: Plane,
      bgColor: "bg-purple-600/20",
      iconColor: "text-purple-600",
      href: "/admin/flights",
    },
    {
      title: "Total Banners",
      value: banners.length,
      icon: ImageIcon,
      bgColor: "bg-orange-600/20",
      iconColor: "text-orange-600",
      href: "/admin/banners",
    },
  ];

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
          {metricsData.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
        <Card>
          <div className="px-4 sm:px-6">
            <h3 className="font-semibold text-muted-foreground mb-4 flex justify-between gap-2">
              <span>Recent Bookings</span>
              <span className="text-sm sm:text-base">
                Total: <span className="font-black">{allBookings.length}</span>
              </span>
            </h3>
            <div>
              {allBookings.length > 0 ? (
                allBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b last:border-0 bg-transparent hover:bg-accent/70 transition-colors gap-3 sm:gap-4"
                  >
                    <div className="flex items-center gap-x-3">
                      <Image
                        src={
                          booking.User?.profileImage || defaultProfileImage()
                        }
                        alt="User profile"
                        width={40}
                        height={40}
                        className="rounded-full size-[40px] sm:size-[50px] border border-muted-foreground/40 hover:border-primary/60 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-muted-foreground font-medium truncate">
                          {booking.User?.firstName} {booking.User?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {booking.User?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:grid sm:gap-2 gap-1 sm:text-right">
                      <span className="font-bold text-base sm:text-lg">
                        Ksh {booking.totalAmount}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {capitalize(booking.seatType)} Class •{" "}
                        {booking.seatCount} seat(s)
                      </span>
                      <span className="text-xs sm:text-sm text-accent-foreground">
                        {formatDate(booking.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <ErrorImage />
                  <p className="text-muted-foreground text-sm sm:text-base mt-2">
                    No bookings found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
        <UserRoleDistribution pieChartData={pieChartData} COLORS={COLORS} />
        <Card>
          <div className="px-4 sm:px-6">
            <h3 className="font-semibold text-muted-foreground mb-4 flex justify-between gap-2">
              <span>Recent Testimonials</span>
              <span className="text-sm sm:text-base">
                Total:{" "}
                <span className="font-black">{allTestimonials.length}</span>
              </span>
            </h3>
            <div className="grid gap-2">
              {allTestimonials.length > 0 ? (
                allTestimonials.slice(0, 3).map((testimonial) => (
                  <Link
                    key={testimonial.id}
                    href={`/admin/testimonials/${testimonial.id}`}
                  >
                    <div className="border-l-4 border-l-primary pl-2 sm:pl-3 flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-4 bg-transparent hover:bg-accent/70 transition-colors gap-3 sm:gap-4">
                      <div className="flex items-center gap-x-3">
                        <Image
                          src={
                            testimonial.user.profileImage ||
                            defaultProfileImage()
                          }
                          alt="User profile"
                          width={40}
                          height={40}
                          className="rounded-full size-[40px] sm:size-[50px] md:size-[60px] border border-muted-foreground/40 hover:border-primary/60 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {testimonial.user.firstName}{" "}
                            {testimonial.user.lastName}
                          </p>
                          <p className="text-sm font-medium text-muted-foreground line-clamp-2 sm:line-clamp-1">
                            {getFirstWords(testimonial.comment, 4)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-1 sm:gap-2">
                        <StarRating rating={testimonial.rating ?? 0} />
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {formatDate(testimonial.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <ErrorImage />
                  <p className="text-muted-foreground text-sm sm:text-base mt-2">
                    No testimonials found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
        <SeatTypeGraph COLOR={COLORS} seatTypeChartData={seatTypeChartData} />

        <TrendGraph trendData={trendData} />
      </div>
    </div>
  );
}
