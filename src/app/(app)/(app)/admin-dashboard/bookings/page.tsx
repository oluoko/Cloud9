import { ChevronLeft, MoreHorizontal, User2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import prisma from "@/utils/db";
import Image from "next/image";
import { capitalize, formatDate, getStatusBadgeVariant2 } from "@/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function getUsersWithBookings() {
  const data = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      bookings: {
        include: {
          Flight: {
            select: {
              id: true,
              flightName: true,
              airlineName: true,
              flightDate: true,
              flightTime: true,
              departureAirport: true,
              arrivalAirport: true,
              flightImages: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

async function getBookings() {
  const data = await prisma.booking.findMany({
    include: {
      User: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profileImage: true,
        },
      },
      Flight: {
        select: {
          id: true,
          flightName: true,
          airlineName: true,
          flightDate: true,
          flightTime: true,
          departureAirport: true,
          arrivalAirport: true,
          flightImages: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function Bookings() {
  const bookings = await getBookings();
  const usersWithBookings = await getUsersWithBookings();

  return (
    <div className="mx-2 md:mx-8 my-4 mt-20">
      <div className="flex justify-between items-center my-4">
        <Link
          href="/dashboard"
          className="rounded-full bg-secondary-foreground/40 p-2 hover:bg-primary"
        >
          <ChevronLeft className="size-4 md:size-5" />
        </Link>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="bookings">All Bookings</TabsTrigger>
          <TabsTrigger value="users">Users & Their Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                Comprehensive view of all flight bookings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Flight</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Flight Details
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Seats</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={booking.user?.profileImage} />
                                <AvatarFallback>
                                  <User2 className="size-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{`${
                                  booking.user?.firstName || ""
                                } ${booking.user?.lastName || ""}`}</p>
                                <p className="text-xs text-muted-foreground">
                                  {booking.user?.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {booking.Flight?.flightImages?.[0] ? (
                                <Image
                                  src={booking.Flight.flightImages[0]}
                                  className="h-10 w-16 object-cover rounded-md hidden md:block"
                                  width={64}
                                  height={40}
                                  alt="Flight Image"
                                />
                              ) : null}
                              <div>
                                <p className="font-medium">
                                  {booking.Flight?.flightName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {booking.Flight?.airlineName}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div>
                              <p className="text-sm">
                                {booking.Flight?.departureAirport} →{" "}
                                {booking.Flight?.arrivalAirport}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(booking.Flight?.flightDate)} •{" "}
                                {booking.Flight?.flightTime}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant2(
                                booking.bookingStatus
                              )}
                            >
                              {capitalize(booking.bookingStatus)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {booking.seatCount}
                            </span>{" "}
                            × {capitalize(booking.seatType)}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              KES{" "}
                              {booking.totalAmount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(booking.createdAt)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link
                                  href={`/dashboard/bookings/${booking.id}`}
                                >
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem>
                                  Update Status
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Cancel Booking
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col w-full items-center justify-center py-8">
                  <p className="text-xl font-bold">No Bookings Found</p>
                  <p className="text-muted-foreground mt-2">
                    Bookings will appear here once users make reservations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users and Their Bookings</CardTitle>
              <CardDescription>
                View and manage users and their respective bookings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersWithBookings.length > 0 ? (
                <div className="space-y-6">
                  {usersWithBookings.map((user) => (
                    <Card key={user.id} className="border border-border">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.profileImage} />
                              <AvatarFallback>
                                <User2 className="size-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{`${
                                user.firstName || ""
                              } ${user.lastName || ""}`}</CardTitle>
                              <CardDescription>{user.email}</CardDescription>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            {user.bookings.length} Booking
                            {user.bookings.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {user.bookings.length > 0 ? (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Flight</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Seats</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {user.bookings.map((booking) => (
                                  <TableRow key={booking.id}>
                                    <TableCell>
                                      <div className="flex items-center space-x-2">
                                        {booking.Flight?.flightImages?.[0] ? (
                                          <Image
                                            src={booking.Flight.flightImages[0]}
                                            className="h-8 w-12 object-cover rounded-md hidden md:block"
                                            width={48}
                                            height={32}
                                            alt="Flight Image"
                                          />
                                        ) : null}
                                        <div>
                                          <p className="font-medium">
                                            {booking.Flight?.flightName}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {booking.Flight?.departureAirport} →{" "}
                                            {booking.Flight?.arrivalAirport}
                                          </p>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={getStatusBadgeVariant2(
                                          booking.bookingStatus
                                        )}
                                      >
                                        {capitalize(booking.bookingStatus)}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      {booking.seatCount} ×{" "}
                                      {capitalize(booking.seatType)}
                                    </TableCell>
                                    <TableCell>
                                      KES{" "}
                                      {booking.totalAmount.toLocaleString(
                                        "en-US",
                                        { minimumFractionDigits: 2 }
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <Link
                                        href={`/dashboard/bookings/${booking.id}`}
                                      >
                                        <Button variant="outline" size="sm">
                                          View
                                        </Button>
                                      </Link>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="py-4 text-center text-muted-foreground">
                            No bookings found for this user.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col w-full items-center justify-center py-8">
                  <p className="text-xl font-bold">No Users Found</p>
                  <p className="text-muted-foreground mt-2">
                    User data will appear here once registered.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
