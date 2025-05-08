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
  value: string;
  label: string;
}

export default function DestinationsCombobox({
  destinations,
}: {
  destinations: Destinations[];
}) {
  const [openDeparture, setOpenDeparture] = useState(false);
  const [openArrival, setOpenArrival] = useState(false);
  const [departureValue, setDepartureValue] = useState("");
  const [arrivalValue, setArrivalValue] = useState("");
  return (
    <div className="flex justify-between w-full h-[70px] border-[0.5px] border-primary/60 rounded-xl overflow-hidden">
      <Popover open={openDeparture} onOpenChange={setOpenDeparture}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openDeparture}
            className="w-[50%] bg-transparent rounded-none  shadow-none h-full border-r border-primary/60 text-lg md:text-2xl justify-start flex gap-2"
          >
            <PlaneTakeoff size={24} />
            <span>
              {departureValue
                ? destinations.find(
                    (destination) => destination.value === departureValue
                  )?.label
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
                    key={destination.value}
                    value={destination.value}
                    onSelect={(currentValue) => {
                      setDepartureValue(
                        currentValue === departureValue ? "" : currentValue
                      );
                      setOpenDeparture(false);
                    }}
                  >
                    {destination.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        departureValue === destination.value
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
            className="w-[50%] bg-transparent rounded-none shadow-none h-full border-l border-primary/60 text-lg md:text-2xl justify-start flex gap-2"
          >
            <PlaneLanding size={24} />
            <span>
              {arrivalValue
                ? destinations.find(
                    (destination) => destination.value === arrivalValue
                  )?.label
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
                    key={destination.value}
                    value={destination.value}
                    onSelect={(currentValue) => {
                      setArrivalValue(
                        currentValue === arrivalValue ? "" : currentValue
                      );
                      setOpenArrival(false);
                    }}
                  >
                    {destination.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        arrivalValue === destination.value
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
  );
}
