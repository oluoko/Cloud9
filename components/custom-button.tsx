"use client";

import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag } from "lucide-react";
import { useFormStatus } from "react-dom";
import LoadingDots from "./loading-dots";

interface buttonProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}

export function SubmitButton({ text, variant }: buttonProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled variant={variant} className="text-xl">
          <Loader2 className="animate-spin mr-2 size-4" />
          <LoadingDots text="Please Wait" />
        </Button>
      ) : (
        <Button variant={variant} type="submit" className="text-xl">
          {text}
        </Button>
      )}
    </>
  );
}

export function ShoppingBagButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-3 md:mt-5">
          <Loader2 className="mr-4 size-4 md:size-6 animate-spin" />
          <LoadingDots text="Adding to Cart" />
        </Button>
      ) : (
        <Button size="lg" className="w-full mt-3 md:mt-5" type="submit">
          <ShoppingBag className="mr-4 size-4 md:size-6" /> Add to Cart
        </Button>
      )}
    </>
  );
}

export function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled variant="destructive" size="sm">
          <Loader2 className="mr-2 size-4" />
          <LoadingDots text="Deleting" />
        </Button>
      ) : (
        <Button variant="destructive" size="sm" type="submit">
          Delete
        </Button>
      )}
    </>
  );
}

export function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-5">
          <Loader2 className="mr-4 size-4 md:size-6 animate-spin" />
          <LoadingDots text="Processing Checkout" />
        </Button>
      ) : (
        <Button size="lg" className="w-full mt-5" type="submit">
          Checkout
        </Button>
      )}
    </>
  );
}
