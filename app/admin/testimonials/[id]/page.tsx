import DeleteConfirmation from "@/components/DeleteConfirmation";
import { ErrorImage } from "@/components/error-image";
import { StarRating } from "@/components/testimonials";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { defaultProfileImage, getFirstWords } from "@/lib/utils";
import prisma from "@/utils/db";
import Image from "next/image";
import Link from "next/link";

interface TestimonialPageProps {
  params: {
    id: string;
  };
}

async function getTestimonialDetails(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    return testimonial;
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return null;
  }
}

export default async function UserTestimonialPage({
  params,
}: TestimonialPageProps) {
  const testimonial = await getTestimonialDetails(params.id);

  if (!testimonial) {
    return (
      <div className="flex flex-col items-center justify-center">
        <ErrorImage />
        <p className="font-bold">Error fetching testimonial details.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Link href={`/admin/users/${testimonial.user?.id}`}>
        <Card>
          <div className="flex gap-2 mx-2 md:mx-4">
            <Image
              src={testimonial.user?.profileImage || defaultProfileImage()}
              alt="user's Image"
              width={50}
              height={50}
              className="size-[50px] md:size-[75px] border hover:border-primary rounded-full"
            />
            <div className="">
              <h2 className="text-lg font-semibold">
                {testimonial.user?.firstName} {testimonial.user?.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {testimonial.user?.email}
              </p>
            </div>
          </div>
        </Card>
      </Link>
      <Card className="md:col-span-2">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Testimonial Details</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {testimonial.createdAt.toLocaleDateString()}
          </p>
          <StarRating rating={testimonial.rating || 0} />
          <p className="mb-2">
            <strong>Descriptive Title:</strong> {testimonial.descriptiveTitle}
          </p>
          <p className="flex flex-wrap">
            <strong>Testimonial:</strong> {testimonial.comment}
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Delete Testimonial</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Delete User&apos;s Testimonial</DialogTitle>
            <DialogContent>
              <DeleteConfirmation
                id={testimonial.id}
                title={getFirstWords(testimonial.comment, 4)}
                modelType="testimonial"
              />
            </DialogContent>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
