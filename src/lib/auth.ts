import prisma from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const getUserByClerkId = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/dashboard/products");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkUserId: userId as string,
    },
  });

  return user;
};
