import prisma from "@/utils/db";
import { getUserByClerkId } from "@/lib/auth";
import FlightPage from "./_components/flight";

export default async function Flight({ params }: { params: { id: string } }) {
  const flight = await prisma.flight.findUnique({
    where: {
      id: params.id,
    },
  });
  const user = await getUserByClerkId();
  return (
    <div>
      {flight ? (
        <FlightPage flight={flight} user={user} />
      ) : (
        <p>Flight not found.</p>
      )}
    </div>
  );
}
