import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "lucide-react";
import AdminButton from "./AdminButton";

export function Hero() {
  return (
    <section className="min-h-screen bg-[radial-gradient(hsl(0,32%,17%,40%),hsl(24,27%,23%,2 9%),hsl(var(--background))_60%)] flex items-center justify-center text-center text-balance flex-col gap-8 px-4">
      <AdminButton />
      <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight m-4">
        Flight Faster, For Cheaper!
      </h1>
      <p className="text-lg lg:text-3xl max-w-screen-xl">
        Book your next flight with Cloud9 and get the best deals on flights
        worldwide. With over 1000 destinations, we have the perfect flight for
        you. Book now and fly faster, for cheaper!
      </p>
      <SignedIn>
        <Link href="/dashboard">
          <Button className="text-xl md:text-3xl w-[90vw] md:w-auto p-6 items-center flex gap-2">
            Book a Flight
            <ArrowRightIcon className="size-16 mr-4" />
          </Button>
        </Link>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button className="text-lg p-6 flex items-center gap-2 w-[80vw] md:w-auto">
            Get Started
            <ArrowRightIcon className="size-5" />
          </Button>
        </SignInButton>
      </SignedOut>
    </section>
  );
}
