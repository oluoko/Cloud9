import prisma from "@/utils/db";

export const getSearch = async (
  arrival?: string,
  departure?: string,
  airline?: string
) => {
  const flights = await prisma.flight.findMany({
    where: {
      OR: [
        {
          airlineName: {
            contains: airline,
            mode: "insensitive",
          },
        },
        {
          departureAirport: {
            contains: departure,
            mode: "insensitive",
          },
        },
        {
          arrivalAirport: {
            contains: arrival,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return flights;
};
