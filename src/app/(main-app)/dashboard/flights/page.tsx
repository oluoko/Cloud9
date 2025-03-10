import prisma from "@/utils/db";

export default async function Flights() {
  const flights = await prisma.flight.findMany();

  console.log("Available flights:: ", flights);
  return <div>Flights</div>;
}
