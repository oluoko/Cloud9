import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { FaPlane } from "react-icons/fa6";
import { FaPlaneDeparture } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchFlights() {
  const flightType = [
    { id: 0, name: "Return", value: "return" },
    { id: 1, name: "One Way", value: "one-way" },
    { id: 2, name: "Multi City", value: "multi-city" },
  ];
  return (
    <Card className="absolute z-40 top-[85%] md:top-[75%] -translate-x-1/2 -translate-y-1/2  left-[50%] w-[95vw] md:w-[70vw] bg-background/85">
      <div className="hidden md:flex gap-2 items-center border-b border-primary/30 py-2 px-6">
        <FaPlane className="size-4 md:size-6" />
        <h2 className="text-lg md:text-xl font-semibold">Flights</h2>
      </div>

      <CardContent className="p-0 md:py-2 md:px-6 overflow-hidden">
        <div className="flex  md:hidden items-center w-full h-full overflow-hidden bg-primary/45 rounded-xl">
          <span className="text-3xl w-[85%] border-r border-primary/30 py-3 bg-primary/10">
            Search Flights
          </span>
          <span className="w-[15%] h-full flex items-center justify-center">
            <FaPlaneDeparture size={30} />
          </span>
        </div>
        <div className="hidden md:flex justify-between items-center gap-2 my-[10px]">
          <Select>
            <SelectTrigger className="w-[150px] h-[70px] rounded-xl">
              <div className="flex flex-col items-start justify-self-start rounded-xl p-2">
                <span className="text-lg text-foreground/50">Flight Type</span>
                <SelectValue className="text-xl" />
              </div>
            </SelectTrigger>
            <SelectContent align="end">
              {flightType.map((type) => (
                <SelectItem key={type.id} value={type.value}>
                  <span className="text-xl">{type.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-between w-full h-[70px] border-[0.5px] border-primary/60 rounded-xl"></div>
          <Button className="h-[70px] m-0 flex items-center justify-between gap-2">
            <FaPlaneDeparture size={32} />
            <span className="text-xl">Search Flights</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
