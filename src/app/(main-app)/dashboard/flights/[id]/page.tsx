import prisma from "@/utils/db";
import FlightPage from "../../_components/Flight";
import { getUserByClerkId } from "@/lib/auth";

export default async function Flight({ params }: { params: { id: string } }) {
  const flight = await prisma.flight.findUnique({
    where: {
      id: params.id,
    },
  });
  const user = await getUserByClerkId();
  return (
    <div className="container mx-auto mt-8 py-8">
      {flight ? (
        <FlightPage flight={flight} user={user} />
      ) : (
        <p>Flight not found.</p>
      )}
    </div>
  );
}
