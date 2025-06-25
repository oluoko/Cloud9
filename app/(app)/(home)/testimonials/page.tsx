import Testimonials from "@/components/testimonials";
import prisma from "@/utils/db";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex justify-between items-center mb-4">
        <Link
          href="/"
          className="rounded-full bg-secondary-foreground/40 p-2 hover:bg-primary"
        >
          <ChevronLeft className="size-4 md:size-5" />
        </Link>

        <h1 className="text-xl font-bold">Testimonials Page</h1>
      </div>

      <Testimonials testimonials={testimonials} />
    </div>
  );
}
