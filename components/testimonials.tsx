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
import { StarIcon } from "lucide-react";
import { BiSolidQuoteAltRight } from "react-icons/bi";
import { useEffect, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "James Carter",
    designation: "Frequent Traveler",
    company: "Global Ventures",
    testimonial:
      "Booking flights has never been this easy! The interface is user-friendly, and I love the flexible date search. " +
      "I found the best deals within minutes and had my e-ticket in my inbox instantly. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },

  {
    id: 2,
    name: "Lisa Thompson",
    designation: "Business Consultant",
    company: "Thompson & Co.",
    testimonial:
      "This platform saved me so much time! I travel frequently for work, and the ability to compare multiple airlines at once is a game-changer. " +
      "The seamless checkout process and 24/7 customer support make it my go-to for flight bookings.",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },

  {
    id: 3,
    name: "David Kim",
    designation: "Travel Blogger",
    company: "Wanderlust Diaries",
    testimonial:
      "As someone who books flights often, I appreciate the transparent pricing and no hidden fees. " +
      "The ability to filter flights by budget and airline preference makes planning my trips a breeze!",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },

  {
    id: 4,
    name: "Sarah Lopez",
    designation: "Event Planner",
    company: "Lopez Events",
    testimonial:
      "I had to book last-minute tickets for an event, and this service found me the best options at unbeatable prices. " +
      "The instant confirmation and easy rescheduling feature are lifesavers!",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },

  {
    id: 5,
    name: "Robert Green",
    designation: "Software Engineer",
    company: "TechWave",
    testimonial:
      "The best flight booking experience I've ever had! The mobile app is smooth, and I love the real-time price alerts. " +
      "Customer support was also incredibly responsive when I had to modify my itinerary.",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },

  {
    id: 6,
    name: "Emily White",
    designation: "Backpacker",
    company: "Solo Travels",
    testimonial:
      "I managed to book multi-city flights at an amazing price! The fare comparison tool helped me save a lot of money, " +
      "and I appreciate how clear the baggage policies and refund options were. Will definitely use it again!",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];
export default function Testimonials() {
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
    <div className="min-h-screen w-full flex justify-center items-center py-12 px-6 bg-foreground/85 ">
      <div className="w-full">
        <h2 className="mb-14 text-5xl md:text-6xl font-bold text-center tracking-tight text-background">
          Testimonials
        </h2>
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
      </div>
    </div>
  );
}

export function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) {
  return (
    <div className="mb-8 bg-accent rounded-xl p-4">
      <div className="flex items-center justify-between gap-20">
        <div className="hidden lg:block relative shrink-0 aspect-[3/4] size-[150px] bg-muted-foreground/20 rounded-full">
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
                  {testimonial.designation}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="size-4 fill-muted-foreground stroke-muted-foreground" />
              <StarIcon className="size-4 fill-muted-foreground stroke-muted-foreground" />
              <StarIcon className="size-4 fill-muted-foreground stroke-muted-foreground" />
              <StarIcon className="size-4 fill-muted-foreground stroke-muted-foreground" />
              <StarIcon className="size-4 fill-muted-foreground stroke-muted-foreground" />
            </div>
          </div>
          <p className="mt-6 text-lg md:text-2xl leading-normal lg:!leading-normal font-semibold tracking-tight">
            &quot;{testimonial.testimonial}&quot;
          </p>
          <div className="flex sm:hidden md:flex mt-6 items-center gap-4">
            <Avatar>
              <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
                {testimonial.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.designation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
