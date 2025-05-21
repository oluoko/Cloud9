"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  ArrowLeft,
  Loader2,
  Plane,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type UserDetails = {
  id: string;
  clerkUserId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
};

type UserBooking = {
  id: string;
  paymentReference: string;
  paymentMethod: string;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  seatType: string;
  seatCount: number;
  flightId: string;
  createdAt: string;
  flight: {
    flightName: string;
    departureAirport: string;
    arrivalAirport: string;
    flightDate: string;
    flightTime: string;
  };
};

type UserActivity = {
  id: string;
  action: string;
  details: string;
  timestamp: string;
};

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [user, setUser] = useState<UserDetails | null>(null);
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("bookings");

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        setLoading(true);

        // Fetch user details
        const userResponse = await fetch(`/api/admin/users/${userId}`);

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }

        const userData = await userResponse.json();

        if (userData.success) {
          setUser(userData.user);
          setBookings(userData.bookings || []);
          // Set mock activities for now
          setActivities([
            {
              id: "act1",
              action: "Login",
              details: "User logged in from Chrome/Windows",
              timestamp: new Date().toISOString(),
            },
            {
              id: "act2",
              action: "Search",
              details: "Searched for flights to Tokyo",
              timestamp: new Date(Date.now() - 86400000).toISOString(),
            },
          ]);
        } else {
          throw new Error(userData.error || "Failed to fetch user details");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Could not load user details. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  // Function to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to format timestamps
  const formatTimestamp = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to get user's full name
  const getUserName = () => {
    if (!user) return "User";

    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }

    return "Unnamed User";
  };

  // Status badge colors
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewBookingDetails = (bookingId: string) => {
    router.push(`/admin-dashboard/bookings/${bookingId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">
          {error || "User not found"}
        </p>
        <Button onClick={() => router.push("/admin-dashboard/users")}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin-dashboard/users")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">User Details</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Email User</Button>
          <Button variant="destructive">Disable Account</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>User account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-6">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={getUserName()}
                  className="h-32 w-32 rounded-full object-cover border-4 border-background"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="text-lg font-medium">{getUserName()}</p>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p>{user.email}</p>
              </div>

              {user.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p>{user.phoneNumber}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p>Joined {formatDate(user.createdAt)}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="text-xs font-mono break-all mt-1">{user.id}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Clerk User ID</p>
              <p className="text-xs font-mono break-all mt-1">
                {user.clerkUserId}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-xs mt-1">{formatDate(user.updatedAt)}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Edit User Details
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs
            defaultValue="bookings"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notes">Admin Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Bookings</CardTitle>
                  <CardDescription>
                    {bookings.length === 0
                      ? "This user has no bookings yet"
                      : `Showing ${bookings.length} booking${
                          bookings.length !== 1 ? "s" : ""
                        }`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No bookings found for this user
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Flight</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Seat Info</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>
                                <div className="font-medium">
                                  {booking.flight.flightName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {booking.flight.departureAirport} →{" "}
                                  {booking.flight.arrivalAirport}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>{booking.flight.flightDate}</div>
                                <div className="text-xs text-muted-foreground">
                                  {booking.flight.flightTime}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium capitalize">
                                  {booking.seatType}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {booking.seatCount}{" "}
                                  {booking.seatCount === 1 ? "seat" : "seats"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  ${booking.totalAmount.toFixed(2)}
                                </div>
                                <div className="text-xs text-muted-foreground capitalize">
                                  {booking.paymentMethod}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <Badge
                                    className={getPaymentStatusColor(
                                      booking.paymentStatus
                                    )}
                                    variant="outline"
                                  >
                                    {booking.paymentStatus}
                                  </Badge>
                                  <Badge
                                    className={getBookingStatusColor(
                                      booking.bookingStatus
                                    )}
                                    variant="outline"
                                  >
                                    {booking.bookingStatus}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleViewBookingDetails(booking.id)
                                  }
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={bookings.length === 0}
                  >
                    Export Bookings
                  </Button>
                  <Button
                    onClick={() =>
                      router.push(
                        `/admin-dashboard/bookings/new?userId=${userId}`
                      )
                    }
                  >
                    Create New Booking
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Track user&apos;s platform activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activities.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Timestamp</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activities.map((activity) => (
                            <TableRow key={activity.id}>
                              <TableCell>
                                <div className="font-medium">
                                  {activity.action}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>{activity.details}</div>
                              </TableCell>
                              <TableCell>
                                <div>{formatTimestamp(activity.timestamp)}</div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Activity tracking will be implemented soon
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activities.length === 0}
                  >
                    Export Activity Log
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Notes</CardTitle>
                  <CardDescription>
                    Internal notes about this user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No admin notes have been added yet
                    </p>
                    <textarea
                      className="w-full mt-4 p-3 border rounded-md min-h-32"
                      placeholder="Add notes about this user here..."
                    ></textarea>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Save Notes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
