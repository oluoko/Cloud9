import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaPlane } from "react-icons/fa6";
import { FaPlaneDeparture } from "react-icons/fa";

import DestinationsCombobox from "@/components/search-flights/destination-combo-box";
import FlightTypeSelection from "@/components/search-flights/flight-type-selection";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

export default function SearchFlights() {
  const flightType = [
    { id: 0, name: "Return", value: "return" },
    { id: 1, name: "One Way", value: "one-way" },
    { id: 2, name: "Multi City", value: "multi-city" },
  ];
  const destinations = [
    {
      value: "nairobi",
      label: "Nairobi",
    },
    {
      value: "mombasa",
      label: "Mombasa",
    },
    {
      value: "kisumu",
      label: "Kisumu",
    },
    {
      value: "eldoret",
      label: "Eldoret",
    },
  ];
  return (
    <Card className="absolute z-40 top-[80%] md:top-[75%] -translate-x-1/2 -translate-y-1/2  left-[50%] w-[95vw] md:w-[70vw] bg-background/90">
      <div className="hidden md:flex gap-2 items-center border-b border-primary/30 py-2 px-6">
        <FaPlane className="size-4 md:size-6" />
        <h2 className="text-lg md:text-xl font-semibold">Flights</h2>
      </div>

      <CardContent className="p-0 md:py-2 md:px-6">
        <Sheet>
          <SheetTrigger className="flex  md:hidden items-center w-full h-full overflow-hidden bg-primary rounded-xl">
            <span className="text-2xl w-[85%] border-r border-primary/50 py-3 bg-black/5">
              Search Flights
            </span>
            <span className="w-[15%] h-full flex items-center justify-center">
              <FaPlaneDeparture size={30} />
            </span>
          </SheetTrigger>
          <SheetContent side="bottom" className="w-screen h-[50vh] px-0">
            <div className="flex flex-col gap-2 items-center p-4 mt-4">
              <DestinationsCombobox destinations={destinations} />

              <div className="flex justify-between gap-2 w-full">
                <FlightTypeSelection flightType={flightType} />

                <Link href="/search/availability">
                  <Button className="h-[70px] m-0 flex items-center justify-between gap-2">
                    <FaPlaneDeparture size={32} />
                    <span className="text-lg">Search Flights</span>
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex justify-between items-center gap-2 my-[10px]">
          <FlightTypeSelection flightType={flightType} />

          <DestinationsCombobox destinations={destinations} />

          <Link href="/search/availability">
            <Button className="h-[70px] m-0 flex items-center justify-between gap-2">
              <FaPlaneDeparture size={32} />
              <span className="text-xl">Search Flights</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
