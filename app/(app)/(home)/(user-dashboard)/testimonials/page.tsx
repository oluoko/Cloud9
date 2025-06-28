import { TestimonialCard } from "@/components/testimonials";
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
    <div className="flex flex-col items-center justify-center mx-4 md:mx-8">
      <div className="flex justify-between w-full items-center mb-4">
        <Link
          href="/"
          className="rounded-full bg-secondary-foreground/40 p-2 hover:bg-primary"
        >
          <ChevronLeft className="size-4 md:size-5" />
        </Link>

        <h1 className="text-xl font-bold">Testimonials Page</h1>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No testimonials found. Please add some testimonials to see them here.
        </p>
      ) : (
        <div className="flex md:grid grid-cols-2 gap-4">
          {testimonials.map((testimonial) => (
            <TestimonialCard testimonial={testimonial} key={testimonial.id} />
          ))}
        </div>
      )}
    </div>
  );
}
