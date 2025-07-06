"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, PlaneLanding, PlaneTakeoff } from "lucide-react";
import { FaPlaneDeparture } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import qs from "query-string";

interface Destination {
  id: string;
  airlineName: { label: string; value: string };
  departureAirport: { label: string; value: string };
  arrivalAirport: { label: string; value: string };
}

interface SearchParams {
  airline: string;
  departure: string;
  arrival: string;
  [key: string]: string;
}

// Optimized Combobox Component
function ComboSelect({
  items,
  value,
  onSelect,
  placeholder,
  icon: Icon,
  className = "",
}: {
  items: { label: string; value: string }[];
  value: string;
  onSelect: (value: string) => void;
  placeholder: string;
  icon: any;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (currentValue: string) => {
    onSelect(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  const selectedItem = items.find((item) => item.value === value);

  // Remove duplicates based on value
  const uniqueItems = items.filter(
    (item, index, self) =>
      index === self.findIndex((i) => i.value === item.value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-10 justify-start gap-2 text-base bg-background/50 border-muted-foreground/20",
            className
          )}
        >
          <Icon size={18} className="text-muted-foreground" />
          <span className="truncate">{selectedItem?.label || placeholder}</span>
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {uniqueItems.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={handleSelect}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Optimized DestinationsCombobox
function DestinationsCombobox({
  destinations,
  onSearchChange,
}: {
  destinations: Destination[];
  onSearchChange: (params: SearchParams) => void;
}) {
  const [params, setParams] = useState<SearchParams>({
    airline: "",
    departure: "",
    arrival: "",
  });

  const updateParams = (key: keyof SearchParams, value: string) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onSearchChange(newParams);
  };

  // Extract unique values
  const airlines = [
    ...new Map(
      destinations.map((d) => [d.airlineName.value, d.airlineName])
    ).values(),
  ];
  const departures = [
    ...new Map(
      destinations.map((d) => [d.departureAirport.value, d.departureAirport])
    ).values(),
  ];
  const arrivals = [
    ...new Map(
      destinations.map((d) => [d.arrivalAirport.value, d.arrivalAirport])
    ).values(),
  ];

  return (
    <div className="grid gap-3 w-full">
      <ComboSelect
        items={airlines}
        value={params.airline}
        onSelect={(value) => updateParams("airline", value)}
        placeholder="Select airline"
        icon={PlaneTakeoff}
      />
      <div className="grid grid-cols-2 gap-3">
        <ComboSelect
          items={departures}
          value={params.departure}
          onSelect={(value) => updateParams("departure", value)}
          placeholder="From"
          icon={PlaneTakeoff}
        />
        <ComboSelect
          items={arrivals}
          value={params.arrival}
          onSelect={(value) => updateParams("arrival", value)}
          placeholder="To"
          icon={PlaneLanding}
        />
      </div>
    </div>
  );
}

// Optimized SearchFlights Component
export default function SearchFlights({
  destinations,
}: {
  destinations: Destination[];
}) {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    airline: "",
    departure: "",
    arrival: "",
  });

  const handleSearch = () => {
    if (
      !searchParams.departure ||
      !searchParams.arrival ||
      !searchParams.airline
    ) {
      toast.error("Please fill in all fields before searching.");
      return;
    }

    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: searchParams,
      },
      { skipEmptyString: true }
    );

    toast.success("Searching for flights...");

    router.push(url);
  };

  const SearchButton = ({ className }: { className?: string }) => (
    <Button
      onClick={handleSearch}
      size="lg"
      className={`h-10 gap-2 min-w-fit ${className}`}
    >
      <FaPlaneDeparture size={20} />
      <span className="font-medium">Search</span>
    </Button>
  );

  return (
    <Card className="absolute top-[85%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-[70vw] bg-transparent md:bg-background/95 border-none md:border md:border-primary/70 z-20 shadow-none md:shadow-md">
      <CardContent className="p-0 md:py-0 md:px-8">
        {/* Mobile Sheet */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="default"
              size="lg"
              className="w-full h-14 text-lg gap-3 bg-gradient-to-r from-foreground to-primary/80 border border-primary/80"
            >
              <span>Search Flights</span>
              <FaPlaneDeparture size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh]">
            <div className="p-4 space-y-4 mt-6">
              <h2 className="text-xl font-semibold text-center">
                Find Your Flight
              </h2>
              <DestinationsCombobox
                destinations={destinations}
                onSearchChange={setSearchParams}
              />
              <SearchButton className="w-full" />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-end gap-4">
          <div className="flex-1">
            <DestinationsCombobox
              destinations={destinations}
              onSearchChange={setSearchParams}
            />
          </div>
          <SearchButton className="h-10" />
        </div>
      </CardContent>
    </Card>
  );
}
