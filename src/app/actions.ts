"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";

import { revalidatePath } from "next/cache";
import { flightSchema, bannerSchema } from "@/lib/zodSchemas";
import prisma from "@/utils/db";

export async function createFlight(preveState: unknown, formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
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
      departure: submission.value.departure,
      departureAirport: submission.value.departureAirport,
      arrivalAirport: submission.value.arrivalAirport,
      arrival: submission.value.arrival,
    },
  });
  revalidatePath("/admin-dashboard/flights");
  redirect("/admin-dashboard/flights");
}

export async function editFlight(prevState: unknown, formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
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
      departure: submission.value.departure,
      departureAirport: submission.value.departureAirport,
      arrivalAirport: submission.value.arrivalAirport,
      arrival: submission.value.arrival,
    },
  });

  revalidatePath("/admin-dashboard/flights");
  redirect("/admin-dashboard/flights");
}

export async function deleteProduct(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  await prisma.flight.delete({
    where: {
      id: formData.get("flightId") as string,
    },
  });

  revalidatePath("/admin-dashboard/flights");
  redirect("/admin-dashboard/flights");
}

export async function createBanner(preveState: unknown, formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const submission = parseWithZod(formData, {
    schema: bannerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.banner.create({
    data: {
      title: submission.value.title,
      description: submission.value.description,
      destinationCity: submission.value.destinationCity,
      largeImageUrl: submission.value.largeImageUrl,
      smallImageUrl: submission.value.smallImageUrl,
      isActive: submission.value.isActive,
      startDate: submission.value.startDate,
      endDate: submission.value.endDate,
    },
  });
  revalidatePath("/admin-dashboard/banners");
  redirect("/admin-dashboard/banners");
}

export async function editBanner(prevState: unknown, formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const submission = parseWithZod(formData, {
    schema: bannerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const bannerId = formData.get("bannerId") as string;
  const banner = await prisma.banner.update({
    where: {
      id: bannerId,
    },
    data: {
      title: submission.value.title,
      description: submission.value.description,
      destinationCity: submission.value.destinationCity,
      largeImageUrl: submission.value.largeImageUrl,
      smallImageUrl: submission.value.smallImageUrl,
      isActive: submission.value.isActive,
      startDate: submission.value.startDate,
      endDate: submission.value.endDate,
    },
  });

  revalidatePath("/admin-dashboard/banners");
  redirect("/admin-dashboard/banners");
}

export async function deleteBanner(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  await prisma.banner.delete({
    where: {
      id: formData.get("bannerId") as string,
    },
  });

  revalidatePath("/admin-dashboard/banners");
  redirect("/admin-dashboard/banners");
}
