import { Plane } from "lucide-react";

export function FlightRoute({ departure, arrival, size = "medium" }) {
  const textSize = size === "large" ? "font-semibold" : "text-sm";
  const iconSize = size === "large" ? 5 : 4;

  return (
    <div
      className={`flex items-center justify-between ${
        size === "large" ? "mb-2" : ""
      } ${textSize}`}
    >
      <div className={textSize}>{departure}</div>
      <Plane
        className={`h-${iconSize} w-${iconSize} mx-${
          size === "large" ? "4" : "2"
        } text-primary`}
      />
      <div className={textSize}>{arrival}</div>
    </div>
  );
}
