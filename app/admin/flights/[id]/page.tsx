import prisma from "@/utils/db";
import { EditFlightForm } from "../../_components/edit-flight-form";
import AppNotFoundPage from "@/app/not-found";

export default async function EditFlight({
  params,
}: {
  params: { id: string };
}) {
  const flight = await prisma.flight.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!flight) return <AppNotFoundPage />;

  return <EditFlightForm data={flight} />;
}
