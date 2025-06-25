"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { flightSchema } from "@/lib/zodSchemas";
import prisma from "@/utils/db";
import { getUserByClerkId } from "@/lib/auth";

export async function createFlight(preveState: unknown, formData: FormData) {
  const user = await getUserByClerkId();
  if (!user) {
    return redirect("/login");
  }

  const submission = parseWithZod(formData, {
    schema: flightSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const flattenUrls = submission.value.flightImages.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  const newFlight = await prisma.flight.create({
    data: {
      flightName: submission.value.flightName,
      flightDate: submission.value.flightDate,
      flightTime: submission.value.flightTime,
      flightImages: flattenUrls,
      airlineName: submission.value.airlineName,
      economySeats: submission.value.economySeats,
      businessSeats: submission.value.businessSeats,
      firstClassSeats: submission.value.firstClassSeats,
      economyPrice: submission.value.economyPrice,
      businessPrice: submission.value.businessPrice,
      firstClassPrice: submission.value.firstClassPrice,
      departureAirport: submission.value.departureAirport,
      arrivalAirport: submission.value.arrivalAirport,
    },
  });
  revalidatePath("/admin/flights");
  redirect("/admin/flights");
}

export async function editFlight(prevState: unknown, formData: FormData) {
  const user = await getUserByClerkId();
  if (!user) {
    return redirect("/login");
  }

  const submission = parseWithZod(formData, {
    schema: flightSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const flattenUrls = submission.value.flightImages.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  const flightId = formData.get("flightId") as string;
  const flight = await prisma.flight.update({
    where: {
      id: flightId,
    },
    data: {
      flightName: submission.value.flightName,
      flightDate: submission.value.flightDate,
      flightTime: submission.value.flightTime,
      flightImages: flattenUrls,
      airlineName: submission.value.airlineName,
      economySeats: submission.value.economySeats,
      businessSeats: submission.value.businessSeats,
      firstClassSeats: submission.value.firstClassSeats,
      economyPrice: submission.value.economyPrice,
      businessPrice: submission.value.businessPrice,
      firstClassPrice: submission.value.firstClassPrice,
      departureAirport: submission.value.departureAirport,
      arrivalAirport: submission.value.arrivalAirport,
    },
  });

  revalidatePath("/admin/flights");
  redirect("/admin/flights");
}

export async function deleteFlight(flightId: string) {
  const user = await getUserByClerkId();
  if (!user) {
    return redirect("/login");
  }

  await prisma.flight.delete({
    where: {
      id: flightId,
    },
  });

  revalidatePath("/admin/flights");
  redirect("/admin/flights");
}
