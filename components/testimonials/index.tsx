"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { BiSolidQuoteAltRight } from "react-icons/bi";
import { useEffect, useState } from "react";
import { Testimonial } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="w-full flex justify-center items-center py-12 px-6 bg-foreground">
      <div className="w-full">
        <h2 className="mb-14 text-5xl md:text-6xl font-bold text-center tracking-tight text-background">
          Testimonials
        </h2>
        {testimonials.length > 0 ? (
          <div className="container w-full lg:max-w-screen-lg xl:max-w-screen-xl mx-auto px-12">
            <Carousel setApi={setApi}>
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id}>
                    <TestimonialCard testimonial={testimonial} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn("h-3.5 w-3.5 rounded-full border-2", {
                    "bg-primary border-primary": current === index + 1,
                  })}
                  title={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full items-center justify-center text-background/80">
            <p className="text-xl font-bold">No Testimonials Yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  const stars = [];
  const totalStars = 5;

  // Ensure rating is between 0 and 5
  const clampedRating = Math.max(0, Math.min(totalStars, rating));

  for (let i = 1; i <= totalStars; i++) {
    const isFilled = i <= clampedRating;
    stars.push(
      <span key={i}>
        {isFilled ? (
          <StarFilledIcon className="size-4 text-yellow-500" />
        ) : (
          <StarIcon className="size-4 text-muted-foreground" />
        )}
      </span>
    );
  }

  return <div className="flex items-center gap-1">{stars}</div>;
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Link href={`/testimonials#${testimonial.id}`}>
      <div className="mb-8 bg-accent rounded-xl p-4">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden lg:block relative shrink-0 aspect-[3/4] size-[150px] bg-muted-foreground/20 rounded-full">
            <Image
              src={testimonial.imageUrl ?? "/default-avatar.png"}
              alt={testimonial.name}
              layout="fill"
              className="rounded-full"
            />
            <div className="absolute top-1/4 right-0 translate-x-1/2 size-6 bg-primary rounded-full flex items-center justify-center">
              <BiSolidQuoteAltRight className="size-4 text-primary-foreground" />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-between gap-1">
              <div className="hidden sm:flex md:hidden items-center gap-4">
                <Avatar className="w-8 h-8 md:w-10 md:h-10">
                  <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.descriptiveTitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={testimonial.rating ?? 0} />
                <span className="text-xs text-muted-foreground ml-1">
                  ({testimonial.rating}/5)
                </span>
              </div>
            </div>
            <p className="mt-6 text-lg md:text-2xl leading-normal lg:!leading-normal font-semibold tracking-tight">
              &quot;{testimonial.comment}&quot;
            </p>
            <div className="flex sm:hidden md:flex mt-6 items-center gap-4">
              <Avatar>
                <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
                  {testimonial.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">
                  {testimonial.descriptiveTitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
