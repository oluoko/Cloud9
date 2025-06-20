import prisma from "@/utils/db";

async function getData() {
  const data = await prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function Bookings() {
  const flights = await getData();
  return <div className="">Bookings</div>;
}
