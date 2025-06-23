import Image from "next/image";
import { Plane } from "lucide-react";

interface FlightImageProps {
  images: string[];
  airlineName: string;
  size?: "small" | "medium" | "large";
}

export function FlightImage({
  images,
  airlineName,
  size = "medium",
}: FlightImageProps) {
  const iconSize = size === "large" ? 64 : 48;
  const className = "object-cover h-full";

  if (images && images.length > 0) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={images[0]}
          alt={`${airlineName} flight`}
          width={400}
          height={10}
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
