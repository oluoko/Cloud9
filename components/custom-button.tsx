"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import LoadingDots from "./loading-dots";
import { cn } from "@/lib/utils";

interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  loadingText?: string;
  disabled?: boolean;
  isPending?: boolean;
  className?: string;
  onClick?: (e: React.FormEvent) => void | Promise<void>;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  useFormStatus?: boolean; // New prop to control when to use useFormStatus
}

export function SubmitButton({
  text,
  loadingText,
  isPending = false,
  type = "submit",
  className,
  disabled = false,
  variant = "default",
  size = "default",
  onClick,
  useFormStatus = false,
}: ButtonProps) {
  const formStatus = useFormStatus();

  // Use form status only if explicitly requested and available
  const pending = useFormStatus ? formStatus?.pending || isPending : isPending;

  const handleClick = async (e: React.FormEvent) => {
    if (onClick) {
      await onClick(e);
    }
  };

  return (
    <Button
      type={type}
      disabled={disabled || pending}
      variant={variant}
      size={size}
      className={cn("text-xl w-full", className)}
      onClick={handleClick}
    >
      {pending && <Loader2 className="animate-spin mr-2 size-4" />}
      {pending ? (
        loadingText ? (
          <LoadingDots text={loadingText} size="lg" />
        ) : (
          <LoadingDots text={text} size="lg" />
        )
      ) : (
        text
      )}
    </Button>
  );
}

export function DeleteButton({
  text,
  loadingText,
  isPending = false,
  type = "button",
  className,
  disabled = false,
  variant = "destructive",
  size = "sm",
  onClick,
  useFormStatus = false,
}: ButtonProps) {
  const formStatus = useFormStatus();

  // Use form status only if explicitly requested and available
  const pending = useFormStatus ? formStatus?.pending || isPending : isPending;

  const handleClick = async (e: React.FormEvent) => {
    if (onClick) {
      await onClick(e);
    }
  };

  return (
    <Button
      type={type}
      disabled={disabled || pending}
      variant={variant}
      size={size}
      className={cn("text-xl w-full", className)}
      onClick={handleClick}
    >
      {pending && <Loader2 className="animate-spin mr-2 size-4" />}
      {pending ? (
        loadingText ? (
          <LoadingDots text={loadingText} size="lg" />
        ) : (
          <LoadingDots text={text} size="lg" />
        )
      ) : (
        text
      )}
    </Button>
  );
}

// Even more reusable generic button
export function CustomButton({
  text,
  loadingText,
  isPending = false,
  type = "button",
  className,
  disabled = false,
  variant = "default",
  size = "default",
  onClick,
  useFormStatus = false,
}: ButtonProps) {
  const formStatus = useFormStatus();

  const pending = useFormStatus ? formStatus?.pending || isPending : isPending;

  const handleClick = async (e: React.FormEvent) => {
    if (onClick) {
      await onClick(e);
    }
  };

  return (
    <Button
      type={type}
      disabled={disabled || pending}
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={handleClick}
    >
      {pending && <Loader2 className="animate-spin mr-2 size-4" />}
      {pending ? (
        loadingText ? (
          <LoadingDots text={loadingText} size="lg" />
        ) : (
          <LoadingDots text={text} size="lg" />
        )
      ) : (
        text
      )}
    </Button>
  );
}
