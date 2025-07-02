"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import LoadingDots from "./loading-dots";

interface ButtonProps {
  text: string;
  loadingText?: string;
  isPending?: boolean;
  useFormStatus?: boolean;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.FormEvent) => void;
}

export function SubmitButton({
  text,
  loadingText = "Loading",
  isPending = false,
  useFormStatus: shouldUseFormStatus = true,
  className = "",
  disabled = false,
  type = "submit",
  onClick,
  ...props
}: ButtonProps) {
  const formStatus = useFormStatus();

  // Use form status only if explicitly requested and available
  const pending = shouldUseFormStatus
    ? formStatus?.pending || isPending
    : isPending;

  return (
    <Button
      type={type}
      disabled={pending || disabled}
      className={className}
      onClick={onClick}
      {...props}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? <LoadingDots text={loadingText} /> : text}
    </Button>
  );
}

export function DeleteButton({
  text,
  loadingText = "Deleting...",
  isPending = false,
  useFormStatus: shouldUseFormStatus = false,
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}: ButtonProps) {
  const formStatus = useFormStatus();

  // Use form status only if explicitly requested and available
  const pending = shouldUseFormStatus
    ? formStatus?.pending || isPending
    : isPending;

  return (
    <Button
      type={type}
      variant="destructive"
      disabled={pending || disabled}
      className={className}
      onClick={onClick}
      {...props}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? <LoadingDots text={loadingText} /> : text}
    </Button>
  );
}
