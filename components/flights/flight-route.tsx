import { FaPlane } from "react-icons/fa";

interface FlightRouteProps {
  departure: string;
  arrival: string;
  size?: "small" | "medium" | "large";
}

export function FlightRoute({
  departure,
  arrival,
  size = "medium",
}: FlightRouteProps) {
  const textSize = size === "large" ? "font-semibold" : "text-sm";
  const iconSize = size === "large" ? 5 : 4;

  return (
    <div
      className={`flex items-center justify-between ${
        size === "large" ? "mb-2" : ""
      } ${textSize}`}
    >
      <div className={textSize}>{departure}</div>
      <div className="grow mx-4 relative">
        <div className="border-t-2 border-dashed border-primary w-full absolute top-1/2" />
        <FaPlane
          className={`h-${iconSize} w-${iconSize} mx-${
            size === "large" ? "4" : "2"
          } text-primary absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2`}
        />
      </div>
      <div className={textSize}>{arrival}</div>
    </div>
  );
}
