import prisma from "@/utils/db";
import { getUserByClerkId } from "@/lib/auth";
import FlightPage from "./_components/flight";
import { ErrorImage } from "@/components/error-image";

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
        <div className="flex flex-col items-center justify-center">
          <ErrorImage />
          <p>Flight not found.</p>
        </div>
      )}
    </div>
  );
}
