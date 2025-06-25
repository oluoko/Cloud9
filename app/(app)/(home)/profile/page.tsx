import Footer from "@/components/footer";
import CreateTestimonial from "@/components/testimonials/create-testimonial";
import { getUserByClerkId } from "@/lib/auth";
import prisma from "@/utils/db";

export default async function ProfilePage() {
  const user = await getUserByClerkId();
  const testimonial = await prisma.testimonial.findUnique({
    where: {
      userId: user.id,
    },
  });
  return (
    <div className="overflow-hidden">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
        <p className="text-gray-600">This is the profile page.</p>
      </div>
      <CreateTestimonial />
      <Footer />
    </div>
  );
}
