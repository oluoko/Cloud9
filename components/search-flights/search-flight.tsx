"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaPlane } from "react-icons/fa6";
import { FaPlaneDeparture } from "react-icons/fa";
import DestinationsCombobox from "@/components/search-flights/destination-combo-box";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import qs from "query-string";

interface SearchFlightsProps {
  destinations: {
    id: string;
    airlineName: {
      label: string;
      value: string;
    };
    departureAirport: {
      label: string;
      value: string;
    };
    arrivalAirport: {
      label: string;
      value: string;
    };
  }[];
}

export default function SearchFlights({ destinations }: SearchFlightsProps) {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    airline: "",
    departure: "",
    arrival: "",
  });

  const handleSearchChange = (params: {
    airline: string;
    departure: string;
    arrival: string;
  }) => {
    setSearchParams(params);
  };

  const handleSearch = () => {
    // Validate required fields
    if (!searchParams.departure || !searchParams.arrival) {
      toast.error("Please select both departure and arrival airports.");
      return;
    }

    // Build query string
    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: {
          airline: searchParams.airline,
          departure: searchParams.departure,
          arrival: searchParams.arrival,
        },
      },
      { skipEmptyString: true }
    );

    // Navigate to search page
    router.push(url);
  };

  return (
    <Card className="absolute z-40 top-[85%] -translate-x-1/2 -translate-y-1/2  left-[50%] w-[95vw] md:w-[70vw] p-2 px-2 md:bg-background/90">
      <CardContent>
        <Sheet>
          <SheetTrigger className="flex  md:hidden items-center w-full h-full overflow-hidden bg-primary rounded-xl">
            <span className="text-2xl w-full md:w-[85%] border-r border-primary/50 py-3 bg-black/5">
              Search Flights
            </span>
            <span className="w-[15%] h-full flex items-center justify-center">
              <FaPlaneDeparture size={30} />
            </span>
          </SheetTrigger>
          <SheetContent side="bottom" className="w-screen h-[50vh] px-0">
            <div className="flex flex-col gap-2 items-center p-4 mt-8">
              <DestinationsCombobox
                destinations={destinations}
                onSearchChange={handleSearchChange}
              />
              <div className="flex justify-between gap-2 w-full">
                <Button
                  onClick={handleSearch}
                  className="h-[70px] m-0 flex items-center justify-between gap-2"
                >
                  <FaPlaneDeparture size={32} />
                  <span className="text-lg">Search Flights</span>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="hidden md:flex justify-between items-center gap-2 my-[10px]">
          <DestinationsCombobox
            destinations={destinations}
            onSearchChange={handleSearchChange}
          />
          <Button
            onClick={handleSearch}
            className="h-[50px] m-0 flex items-center justify-between gap-2"
          >
            <FaPlaneDeparture size={32} />
            <span className="text-xl">Search Flights</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
