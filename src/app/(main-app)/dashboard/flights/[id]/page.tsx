import prisma from "@/utils/db";
import FlightPage from "../../_components/Flight";

export default async function Flight({ params }: { params: { id: string } }) {
  const flight = await prisma.flight.findUnique({
    where: {
      id: params.id,
    },
  });
  return (
    <div className="container mx-auto mt-8 py-8">
      <FlightPage flight={flight} />
    </div>
  );
}
