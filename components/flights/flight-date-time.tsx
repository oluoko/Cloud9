import { Calendar, Clock } from "lucide-react";

interface FlightDateTimeProps {
  date: string;
  time: string;
  size?: "small" | "medium" | "large";
}

export function FlightDateTime({
  date,
  time,
  size = "medium",
}: FlightDateTimeProps) {
  const iconSize = size === "large" ? 5 : 4;
  const spacing = size === "large" ? "mr-2" : "mr-1";
  const textSize = size === "large" ? "" : "text-sm";

  return (
    <div
      className={`flex justify-between ${
        size === "large" ? "mb-4" : "mb-3"
      } ${textSize}`}
    >
      <div className="flex items-center">
        <Calendar
          className={`h-${iconSize} w-${iconSize} ${spacing} text-gray-500`}
        />
        <span>{date}</span>
      </div>
      <div className="flex items-center">
        <Clock
          className={`h-${iconSize} w-${iconSize} ${spacing} text-gray-500`}
        />
        <span>{time}</span>
      </div>
    </div>
  );
}
