import prisma from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const getUserByClerkId = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkUserId: userId as string,
    },
  });

  return user;
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const getUsers = async () => {
  const self = await getUserByClerkId();

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: self.id,
      },
      email: {
        not: process.env.CONTACT_EMAIL,
      },
    },
    include: {
      bookings: true,
      testimonial: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};
