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
        <div className="grid gap-2">
          {testimonials.map((testimonial) => (
            <Link
              key={testimonial.id}
              href={`/admin/testimonials/${testimonial.id}`}
            >
              <TestimonialCard testimonial={testimonial} />
            </Link>
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
