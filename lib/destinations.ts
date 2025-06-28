import prisma from "@/utils/db";

export const getDestinations = async () => {
  const flights = await prisma.flight.findMany();

  const destinations = flights.map((flight) => ({
    id: flight.id,
    airlineName: {
      label: flight.airlineName,
      value: flight.airlineName,
    },
    departureAirport: {
      label: flight.departureAirport,
      value: flight.departureAirport,
    },
    arrivalAirport: {
      label: flight.arrivalAirport,
      value: flight.arrivalAirport,
    },
  }));

  return destinations;
};
