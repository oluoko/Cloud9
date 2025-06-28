"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
  PlaneLanding,
  PlaneTakeoff,
} from "lucide-react";
import { useState } from "react";

interface Destinations {
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
}

interface DestinationsComboboxProps {
  destinations: Destinations[];
  onSearchChange: (searchParams: {
    airline: string;
    departure: string;
    arrival: string;
  }) => void;
}

export default function DestinationsCombobox({
  destinations,
  onSearchChange,
}: DestinationsComboboxProps) {
  const [airlineValue, setAirlineValue] = useState("");
  const [openAirline, setOpenAirline] = useState(false);
  const [openDeparture, setOpenDeparture] = useState(false);
  const [openArrival, setOpenArrival] = useState(false);
  const [departureValue, setDepartureValue] = useState("");
  const [arrivalValue, setArrivalValue] = useState("");

  // Call onSearchChange whenever values change
  const updateSearchParams = (
    airline: string,
    departure: string,
    arrival: string
  ) => {
    onSearchChange({
      airline,
      departure,
      arrival,
    });
  };

  const handleAirlineSelect = (currentValue: string) => {
    const newAirlineValue = currentValue === airlineValue ? "" : currentValue;
    setAirlineValue(newAirlineValue);
    setOpenAirline(false);
    updateSearchParams(newAirlineValue, departureValue, arrivalValue);
  };

  const handleDepartureSelect = (currentValue: string) => {
    const newDepartureValue =
      currentValue === departureValue ? "" : currentValue;
    setDepartureValue(newDepartureValue);
    setOpenDeparture(false);
    updateSearchParams(airlineValue, newDepartureValue, arrivalValue);
  };

  const handleArrivalSelect = (currentValue: string) => {
    const newArrivalValue = currentValue === arrivalValue ? "" : currentValue;
    setArrivalValue(newArrivalValue);
    setOpenArrival(false);
    updateSearchParams(airlineValue, departureValue, newArrivalValue);
  };

  return (
    <div className="grid w-full gap-2">
      <div className="w-full h-[50px] border-[0.5px] border-primary/60 rounded-xl overflow-hidden mb-2">
        <Popover open={openAirline} onOpenChange={setOpenAirline}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openAirline}
              className="w-full bg-transparent rounded-none shadow-none h-full border-none text-lg md:text-xl justify-start flex gap-2"
            >
              <ChevronsUpDown size={24} />
              <span>
                {airlineValue
                  ? destinations.find(
                      (destination) =>
                        destination.airlineName.value === airlineValue
                    )?.airlineName.label
                  : "Select airline"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput className="h-9" />
              <CommandList>
                <CommandEmpty>No airline found.</CommandEmpty>
                <CommandGroup>
                  {destinations.map((destination) => (
                    <CommandItem
                      key={destination.airlineName.value}
                      value={destination.airlineName.value}
                      onSelect={handleAirlineSelect}
                    >
                      {destination.airlineName.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          airlineValue === destination.airlineName.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex justify-between w-full h-[50px] border-[0.5px] border-primary/60 rounded-xl overflow-hidden">
        <Popover open={openDeparture} onOpenChange={setOpenDeparture}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openDeparture}
              className="w-[50%] bg-transparent rounded-none  shadow-none h-full border-r border-primary/60 text-lg md:text-xl justify-start flex gap-2"
            >
              <PlaneTakeoff size={24} />
              <span>
                {departureValue
                  ? destinations.find(
                      (destination) =>
                        destination.departureAirport.value === departureValue
                    )?.departureAirport.label
                  : "Where from?"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput className="h-9" />
              <CommandList>
                <CommandEmpty>No destination found.</CommandEmpty>
                <CommandGroup>
                  {destinations.map((destination) => (
                    <CommandItem
                      key={destination.departureAirport.value}
                      value={destination.departureAirport.value}
                      onSelect={handleDepartureSelect}
                    >
                      {destination.departureAirport.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          departureValue === destination.departureAirport.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Popover open={openArrival} onOpenChange={setOpenArrival}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openArrival}
              className="w-[50%] bg-transparent rounded-none shadow-none h-full border-l border-primary/60 text-lg md:text-xl justify-start flex gap-2"
            >
              <PlaneLanding size={24} />
              <span>
                {arrivalValue
                  ? destinations.find(
                      (destination) =>
                        destination.arrivalAirport.value === arrivalValue
                    )?.arrivalAirport.label
                  : "Where to?"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput className="h-9" />
              <CommandList>
                <CommandEmpty>No destination found.</CommandEmpty>
                <CommandGroup>
                  {destinations.map((destination) => (
                    <CommandItem
                      key={destination.arrivalAirport.value}
                      value={destination.arrivalAirport.value}
                      onSelect={handleArrivalSelect}
                    >
                      {destination.arrivalAirport.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          arrivalValue === destination.arrivalAirport.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
