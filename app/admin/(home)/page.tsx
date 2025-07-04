import { Card } from "@/components/ui/card";
import { getUsers } from "@/lib/auth";
import prisma from "@/utils/db";
import { Calendar, DollarSign, Star, Users } from "lucide-react";

export default async function AdminDashboardHome() {
  const usersBookingsTestimonials = await getUsers();
  const bookings = usersBookingsTestimonials.map((user) => ({
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImage: user.profileImage,
    bookings: user.bookings,
  }));

  const testimonials = usersBookingsTestimonials.map((user) => ({
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImage: user.profileImage,
    testimonial: user.testimonial,
  }));

  const flights = await prisma.flight.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-muted-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-accent-foreground">
          Welcome back! Here&apos;s what&apos;s been happening with Cloud9.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between px-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users(Not you 😉)
                </p>
                <p className="text-2xl font-bold text-accent-foreground">
                  {usersBookingsTestimonials.length}
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
                  Total Bookings(Not you 😉)
                </p>
                <p className="text-2xl font-bold text-accent-foreground">
                  {bookings.length}
                </p>
              </div>
              <div className="p-3 bg-yellow-600/20 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
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
                  {bookings.length}
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
                  {bookings.length}
                </p>
              </div>
              <div className="p-3 bg-purple-600/20 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
