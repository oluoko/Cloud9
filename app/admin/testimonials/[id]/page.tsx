import DeleteConfirmation from "@/components/DeleteConfirmation";
import { ErrorImage } from "@/components/error-image";
import ItemNotFound from "@/components/item-not-found";
import { StarRating } from "@/components/testimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { defaultProfileImage, getFirstWords } from "@/lib/utils";
import prisma from "@/utils/db";
import { Calendar, User, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function UserTestimonialPage({
  params,
}: {
  params: { id: string };
}) {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id: params.id },
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

  if (!testimonial) {
    return <ItemNotFound item="testimonial" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6" id={`${testimonial.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Link
              href={`/admin/users/${testimonial.user?.id}`}
              className="flex items-center space-x-4 hover:opacity-80 transition-opacity flex-1"
            >
              <div className="relative">
                <Image
                  src={testimonial.user?.profileImage || defaultProfileImage()}
                  alt={`${testimonial.user?.firstName}'s profile`}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full border-2 border-muted hover:border-primary transition-colors object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full">
                  <User className="w-3 h-3" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold truncate">
                  {testimonial.user?.firstName} {testimonial.user?.lastName}
                </h2>
                <p className="text-sm text-muted-foreground truncate">
                  {testimonial.user?.email}
                </p>
              </div>
            </Link>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Testimonial Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(testimonial.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <StarRating rating={testimonial.rating || 0} />
              <span className="text-sm text-muted-foreground ml-2">
                ({testimonial.rating || 0}/5)
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {testimonial.descriptiveTitle && (
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {testimonial.descriptiveTitle}
                </h3>
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                Testimonial
              </p>
              <blockquote className="text-base leading-relaxed">
                &ldquo;{testimonial.comment}&rdquo;
              </blockquote>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  Delete Testimonial
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Delete Testimonial</DialogTitle>
                <DeleteConfirmation
                  id={testimonial.id}
                  title={getFirstWords(testimonial.comment, 4)}
                  modelType="testimonial"
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
