import CreateTestimonial from "@/components/testimonials/create-testimonial";
import EditTestimonial from "@/components/testimonials/edit-testimonial";
import { getUserByClerkId } from "@/lib/auth";
import prisma from "@/utils/db";
import { UpdateProfile } from "./_components/update-profile";

export default async function ProfilePage() {
  const user = await getUserByClerkId();
  const testimonial = await prisma.testimonial.findUnique({
    where: {
      userId: user.id,
    },
  });
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 items-center overflow-x-hidden
    "
    >
      <div className="md:col-span-1">
        <UpdateProfile />
      </div>
      <div className="md:col-span-2">
        {testimonial ? (
          <EditTestimonial data={testimonial} />
        ) : (
          <CreateTestimonial />
        )}
      </div>
    </div>
  );
}
