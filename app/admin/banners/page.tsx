import prisma from "@/utils/db";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import DeleteConfirmation from "@/components/DeleteConfirmation";

async function getData() {
  const data = await prisma.banner.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function Banners() {
  const banners = await getData();

  //format date
  const formatDate = (date: string | number | Date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };

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
          href="/admin/banners/create"
          className="rounded-xl bg-primary border border-gray-800/30 p-2"
        >
          Create a new banner
        </Link>
      </div>
      <Card className="mt-3 md:mt-5">
        <CardHeader>
          <CardTitle>Banners</CardTitle>
          <CardDescription>Manage your banners.</CardDescription>
        </CardHeader>
        <CardContent>
          {banners.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead> Large Image</TableHead>
                  <TableHead>Small Image</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>{banner.title}</TableCell>
                    <TableCell>
                      <Image
                        src={banner.largeImageUrl}
                        alt={banner.title}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover size-16"
                      />
                    </TableCell>
                    <TableCell>
                      <Image
                        src={banner.smallImageUrl}
                        alt={banner.title}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover size-16"
                      />
                    </TableCell>
                    <TableCell
                      className={`${
                        banner.isActive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </TableCell>
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
                            <Link href={`/admin/banners/${banner.id}`}>
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
                                  id={banner.id}
                                  title={banner.title}
                                  modelType="banner"
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
              <p className="text-xl font-bold">No Banners Created Yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
