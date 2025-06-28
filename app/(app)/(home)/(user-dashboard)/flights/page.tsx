import MainFlightsInterface from "@/components/flights/main-flights-interface";
import prisma from "@/utils/db";

export default async function FlightsPage() {
  const flights = await prisma.flight.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-4">
      <MainFlightsInterface flights={flights} />
    </div>
  );
}
