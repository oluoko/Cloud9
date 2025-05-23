"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import {
  flightSchema,
  bannerSchema,
  profileSchema,
  payWithCardSchema,
} from "@/lib/zodSchemas";
import prisma from "@/utils/db";
import { getUserByClerkId } from "@/lib/auth";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

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

export async function payUsingCard(prevState: unknown, formData: FormData) {
  const user = await getUserByClerkId();

  if (!user) {
    return redirect("/sign-in");
  }

  const submission = parseWithZod(formData, {
    schema: payWithCardSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const flight = await prisma.flight.findUnique({
    where: {
      id: submission.value.flightId,
    },
  });

  console.log("Payment Details:: ", {
    "Flight Id": submission.value.flightId,
    "Total Amount": submission.value.amount,
    "Seat Type": submission.value.seatType,
    "Seat Count": submission.value.seatCount,
  });

  if (flight) {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "kes",
              unit_amount: submission.value.amount * 100,
              product_data: {
                name: flight.flightName,
                images: flight.flightImages,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        metadata: {
          userId: user.id,
          flightId: flight.id,
          seatType: submission.value.seatType,
          seatCount: submission.value.seatCount,
        },
      });

      if (session.url) {
        return redirect(session.url);
      } else {
        // Handle the case where session.url is null
        return { error: "Failed to create checkout session" };
      }
    } catch (error) {
      console.error("Stripe session creation failed:", error);
      return { error: "Payment processing failed. Please try again." };
    }
  }
}
