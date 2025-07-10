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
import Image from "next/image";
import prisma from "@/utils/db";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DeleteConfirmation from "@/components/DeleteConfirmation";

async function getData() {
  const data = await prisma.flight.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function Flights() {
  const flights = await getData();
  return (
    <>
      <div className="flex justify-between items-center">
        <Link
          href="/admin"
          className="rounded-full bg-secondary-foreground/40 p-2 hover:bg-primary"
        >
          <ChevronLeft className="size-4 md:size-5" />
        </Link>
        <Link
          href="/admin/flights/create"
          className="rounded-xl bg-primary border border-gray-800/30 p-2"
        >
          Create a new flight
        </Link>
      </div>
      <Card className="mt-3 md:mt-5">
        <CardHeader>
          <CardTitle>Flights</CardTitle>
          <CardDescription>
            Manage your flights and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {flights.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Airline</TableHead>
                  <TableHead> Flight Images</TableHead>
                  <TableHead>Departure Aiport</TableHead>
                  <TableHead>Arrival Airport</TableHead>
                  <TableHead className="text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flights.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell>{flight.flightName}</TableCell>
                    <TableCell>{flight.airlineName}</TableCell>
                    <TableCell className="grid grid-cols-1 md:flex gap-2">
                      {flight.flightImages.map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          alt={flight.flightName}
                          width={60}
                          height={60}
                          className="rounded-md md:rounded-lg object-cover size-[35px] md:size-[60px]"
                        />
                      ))}
                    </TableCell>

                    <TableCell>{flight.departureAirport}</TableCell>
                    <TableCell>{flight.arrivalAirport}</TableCell>
                    <TableCell className="text-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/flights/${flight.id}`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Dialog>
                              <DialogTrigger>
                                <span className="p-2 text-sm">Delete</span>
                              </DialogTrigger>
                              <DialogContent>
                                <DeleteConfirmation
                                  id={flight.id}
                                  title={flight.flightName}
                                  modelType="flight"
                                />
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuItem>
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
    </>
  );
}
