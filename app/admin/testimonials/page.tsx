import prisma from "@/utils/db";

async function getData() {
  const data = await prisma.testimonial.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function Testimonials() {
  const testimonials = await getData();
  return <>Testimonials</>;
}
