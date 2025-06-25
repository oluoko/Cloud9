import Flights from "@/components/flights";
import MainFlightsInterface from "@/components/flights/main-flights-interface";
import Footer from "@/components/footer";
import prisma from "@/utils/db";

export default async function FlightsPage() {
  const flights = await prisma.flight.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="mt-20  overflow-hidden">
      <div className="p-4">
        <MainFlightsInterface flights={flights} />
      </div>
      <Footer />
    </div>
  );
}
