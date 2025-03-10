"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { flightSchema, bannerSchema, profileSchema } from "@/lib/zodSchemas";
import prisma from "@/utils/db";
import { getUserByClerkId } from "@/lib/auth";

export async function updateProfile(prevState: unknown, formData: FormData) {
  try {
    const user = await getUserByClerkId();
    if (!user) {
      return redirect("/sign-in");
    }

    const submission = parseWithZod(formData, {
      schema: profileSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    await prisma.user.update({
      where: {
        clerkUserId: user.id,
      },
      data: {
        firstName: submission.value.firstName,
        lastName: submission.value.lastName,
        phoneNumber: submission.value.phoneNumber,
        profileImage: submission.value.profileImage || undefined,
      },
    });

    // Redirects in server actions need special handling
    return { success: true, redirectTo: "/dashboard" };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      status: "error" as const,
      error: "Failed to update profile. Please try again.",
    };
  }
}

export async function editProfile(prevState: unknown, formData: FormData) {
  const user = await getUserByClerkId();
  if (!user) {
    return redirect("/sign-in");
  }

  const submission = parseWithZod(formData, {
    schema: profileSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const userId = formData.get("userId") as string;

  await prisma.user.update({
    where: {
      clerkUserId: userId,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      phoneNumber: submission.value.phoneNumber,
      profileImage: submission.value.profileImage || undefined,
    },
  });

  revalidatePath("/");
  redirect("/dashboard/profile");
}

export async function createFlight(preveState: unknown, formData: FormData) {
  const user = await getUserByClerkId();
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
      departureAirport: submission.value.departureAirport,
      arrivalAirport: submission.value.arrivalAirport,
    },
  });
  revalidatePath("/admin-dashboard/flights");
  redirect("/admin-dashboard/flights");
}

export async function editFlight(prevState: unknown, formData: FormData) {
  const user = await getUserByClerkId();
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
      departureAirport: submission.value.departureAirport,
      arrivalAirport: submission.value.arrivalAirport,
    },
  });

  revalidatePath("/admin-dashboard/flights");
  redirect("/admin-dashboard/flights");
}

export async function deleteFlight(flightId: string) {
  const user = await getUserByClerkId();
  if (!user) {
    return redirect("/sign-in");
  }

  await prisma.flight.delete({
    where: {
      id: flightId,
    },
  });

  revalidatePath("/admin-dashboard/flights");
  redirect("/admin-dashboard/flights");
}

export async function createBanner(preveState: unknown, formData: FormData) {
  const user = await getUserByClerkId();
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
      destinationAirport: submission.value.destinationAirport,
      largeImageUrl: submission.value.largeImageUrl,
      smallImageUrl: submission.value.smallImageUrl,
      isActive: submission.value.isActive,
    },
  });
  revalidatePath("/admin-dashboard/banners");
  redirect("/admin-dashboard/banners");
}

export async function editBanner(prevState: unknown, formData: FormData) {
  const user = await getUserByClerkId();
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
      destinationAirport: submission.value.destinationAirport,
      largeImageUrl: submission.value.largeImageUrl,
      smallImageUrl: submission.value.smallImageUrl,
      isActive: submission.value.isActive,
    },
  });

  revalidatePath("/admin-dashboard/banners");
  redirect("/admin-dashboard/banners");
}

export async function deleteBanner(bannerId: string) {
  const user = await getUserByClerkId();
  if (!user) {
    return redirect("/sign-in");
  }

  await prisma.banner.delete({
    where: {
      id: bannerId,
    },
  });

  revalidatePath("/admin-dashboard/banners");
  redirect("/admin-dashboard/banners");
}
