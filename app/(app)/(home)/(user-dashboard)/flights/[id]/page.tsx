import prisma from "@/utils/db";
import { getUserByClerkId } from "@/lib/auth";
import FlightPage from "./_components/flight";
import ItemNotFound from "@/components/item-not-found";

export default async function Flight({ params }: { params: { id: string } }) {
  const flight = await prisma.flight.findUnique({
    where: {
      id: params.id,
    },
  });
  const user = await getUserByClerkId();
  return (
    <div id={`${params.id}`}>
      {flight ? (
        <FlightPage flight={flight} user={user} />
      ) : (
        <ItemNotFound item="flight" />
      )}
    </div>
  );
}
