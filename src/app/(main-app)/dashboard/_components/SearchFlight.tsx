import { Card, CardHeader } from "@/components/ui/card";
import { FaPlane } from "react-icons/fa6";

export default function SearchFlights() {
  return (
    <Card className="absolute top-[75vw] left-[50%] w-[95vw] md:w-[70vw]">
      <CardHeader className="border-b border-primary/30">
        <FaPlane className="size-6" />
        <h2 className="text-xl font-semibold">Flights</h2>
      </CardHeader>
    </Card>
  );
}
