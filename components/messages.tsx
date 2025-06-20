import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { InfoIcon } from "lucide-react";

interface MessageProps {
  message?: string;
}
export const Error = ({ message }: MessageProps) => {
  if (!message) return null;
  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export const NeutralMessage = ({ message }: MessageProps) => {
  if (!message) return null;

  return (
    <div className="bg-primary/10 p-3 rounded-md flex items-center gap-x-2 text-sm text-primary">
      <InfoIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export const Sucess = ({ message }: MessageProps) => {
  if (!message) return null;
  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
