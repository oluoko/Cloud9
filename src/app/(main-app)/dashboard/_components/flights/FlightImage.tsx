import Image from "next/image";
import { Plane } from "lucide-react";

export function FlightImage({ images, airlineName, size = "medium" }) {
  const iconSize = size === "large" ? 64 : 48;
  const className = "object-cover h-full w-full";

  if (images && images.length > 0) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={images[0]}
          alt={`${airlineName} flight`}
          width={size === "large" ? 800 : 400}
          height={size === "large" ? 250 : 200}
          className={className}
        />
      </div>
    );
  } else {
    return (
      <div className="bg-gray-200 h-full w-full flex items-center justify-center">
        <Plane size={iconSize} className="text-gray-400" />
      </div>
    );
  }
}
