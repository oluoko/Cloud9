"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import LoadingDots from "./loading-dots";
import { cn } from "@/lib/utils";

interface buttonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  loadingText?: string;
  disabled?: boolean;
  isPending?: boolean;
  className?: string;
  onClick?:
    | ((e: React.FormEvent) => Promise<void>)
    | ((e: React.FormEvent<Element>) => Promise<void>)
    | ((e: React.FormEvent<HTMLFormElement>) => Promise<void>);
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

export function SubmitButton({
  text,
  loadingText,
  isPending,
  type,
  className,
  disabled,
  variant,
  onClick,
}: buttonProps) {
  const { pending } = useFormStatus() || isPending;
  return (
    <>
      {pending ? (
        <Button
          disabled={disabled}
          variant={variant}
          className={cn("text-xl w-full md:w-max", className)}
        >
          <Loader2 className="animate-spin mr-2 size-4" />
          {loadingText ? (
            <LoadingDots text={loadingText} size="lg" />
          ) : (
            <LoadingDots text={text} size="lg" />
          )}
        </Button>
      ) : (
        <Button
          variant={variant}
          type={type}
          className={cn("text-xl w-full md:w-max", className)}
        >
          {text}
        </Button>
      )}
    </>
  );
}

export function DeleteButton({
  text,
  loadingText,
  isPending,
  type,
  className,
  disabled,
  variant,
  onClick,
}: buttonProps) {
  const { pending } = useFormStatus() || isPending;

  return (
    <>
      {pending ? (
        <Button
          disabled
          variant="destructive"
          size="sm"
          className={cn("text-xl w-full md:w-max", className)}
        >
          <Loader2 className="animate-spin mr-2 size-4" />
          {loadingText ? (
            <LoadingDots text={loadingText} size="lg" />
          ) : (
            <LoadingDots text={text} size="lg" />
          )}
        </Button>
      ) : (
        <Button
          variant="destructive"
          size="sm"
          type={type}
          disabled={disabled}
          className={cn("text-xl w-full md:w-max", className)}
        >
          {text}
        </Button>
      )}
    </>
  );
}
