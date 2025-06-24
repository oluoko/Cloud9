import { getUserByClerkId } from "@/lib/auth";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import prisma from "@/utils/db";
import Image from "next/image";
import { capitalize, getStatusBadgeVariant } from "@/lib/utils";
import Footer from "@/components/footer";

async function getData(id: string) {
  const data = await prisma.booking.findMany({
    where: {
      userId: id,
    },
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
  });

  return data;
}

export default async function Bookings() {
  const user = await getUserByClerkId();

  const bookings = await getData(user.id);

  return (
    <div className="overflow-hidden">
      <div className="mx-2 md:mx-8 my-4 mt-20">
        <div className="flex justify-between items-center my-4">
          <Link
            href="/"
            className="rounded-full bg-secondary-foreground/40 p-2 hover:bg-primary"
          >
            <ChevronLeft className="size-4 md:size-5" />
          </Link>
        </div>
        <Card className="">
          <CardHeader>
            <CardTitle>Booking</CardTitle>
            <CardDescription>Manage your flight bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flight</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Image
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Booking Status
                    </TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.Flight?.flightName}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {booking.Flight?.flightImages[0] && (
                          <Image
                            src={booking.Flight?.flightImages[0]}
                            className="h-[40px] w-[85px] md:h-[70px] md:w-[100px] object-fill rounded-md"
                            width={80}
                            height={50}
                            alt="Flight Image"
                          />
                        )}
                      </TableCell>
                      <TableCell className={`hidden md:table-cell`}>
                        {capitalize(booking.bookingStatus)}
                      </TableCell>
                      <TableCell>
                        {booking.seatCount} x {capitalize(booking.seatType)}
                      </TableCell>
                      <TableCell>
                        KES {booking.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="flex items-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href={`/bookings/${booking.id}`}>
                              <DropdownMenuItem>View Booking</DropdownMenuItem>
                            </Link>
                            <Link href={`/flights/${booking.Flight?.id}`}>
                              <DropdownMenuItem>View Flight</DropdownMenuItem>
                            </Link>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col w-full items-center justify-center">
                <p className="text-xl font-bold">No Booked Flight Yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
