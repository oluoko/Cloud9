import prisma from "@/utils/db";
import { notFound } from "next/navigation";
import { EditFlightForm } from "../../_components/edit-flight-form";

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

  if (!flight) return notFound();

  return <EditFlightForm data={flight} />;
}
