import { ErrorImage } from "@/components/error-image";
import { TestimonialCard } from "@/components/testimonials";
import prisma from "@/utils/db";
import Link from "next/link";

export default async function Testimonials() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <>
      {testimonials.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-2">
          {testimonials.map((testimonial) => (
            <div className="relative" key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} truncate />
              <Link
                href={`/admin/testimonials/${testimonial.id}`}
                className="absolute z-10 right-2 top-2 bg-background text-foreground px-4 py-2 rounded-md hover:bg-primary transition-colors"
              >
                View Testimonial
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <ErrorImage />
          <p className="text-xl font-bold">No Testimonials Yet.</p>
        </div>
      )}
    </>
  );
}
