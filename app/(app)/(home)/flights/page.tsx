<<<<<<< HEAD
import Flights from "@/components/flights/flights";
import prisma from "@/utils/db";

export default async function FlightsPage() {
  const flights = await prisma.flight.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return <Flights flights={flights} showFlightCards />;
}
=======
export default function FlightsPage() {
  return (
    <div>
      <h1>Flights Page</h1>
      <p>This is the flights page.</p>
    </div>
  );
}
>>>>>>> 1b385eaf9e2d20413d1ebe160e53a4f678621fe9
