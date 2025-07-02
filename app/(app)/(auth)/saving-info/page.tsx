import Loader from "@/components/loader";
import { defaultProfileImage } from "@/lib/utils";
import prisma from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const createNewUser = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }
  const match = await prisma.user.findUnique({
    where: {
      clerkUserId: user.id as string,
    },
  });

  if (!match) {
    await prisma.user.create({
      data: {
        id: user.id,
        clerkUserId: user.id,
        email: user?.emailAddresses[0].emailAddress,
        firstName: user?.firstName,
        lastName: user?.lastName,
        profileImage: defaultProfileImage(),
      },
    });
  }

  redirect("/complete-profile");
};

const NewUser = async () => {
  await createNewUser();
  return (
    <Loader
      mainText="We are adding your information to our database"
      subText="Please wait"
    />
  );
};

export default NewUser;
