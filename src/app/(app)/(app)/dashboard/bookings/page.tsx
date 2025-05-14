import { getUserByClerkId } from "@/lib/auth";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
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
import prisma from "@/utils/db";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

async function getData(id: string) {
  const data = await prisma.booking.findMany({
    where: {
      userId: id,
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
  console.log("userid", user.id);
  console.log("userId", bookings[0].userId);
  console.log("Bookings: ", bookings);

  return (
    <div className="mx-2 md:mx-8 mt-20">
      <div className="flex justify-between items-center my-4">
        <Link
          href="/dashboard"
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
                  <TableHead>Payment Reference</TableHead>
                  <TableHead>Booking Status</TableHead>
                  <TableHead>Seat Count</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.paymentReference}</TableCell>
                    <TableCell>{booking.bookingStatus}</TableCell>
                    <TableCell>{booking.seatCount}</TableCell>
                    <TableCell>KES {booking.totalAmount.toFixed(2)}</TableCell>
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
                          <Link href={`/dashboard/bookings/${booking.id}`}>
                            <DropdownMenuItem>View Booking</DropdownMenuItem>
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
              <p className="text-xl font-bold">No Flights Created Yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
