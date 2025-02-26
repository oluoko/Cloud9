import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaPlane } from "react-icons/fa6";
import { FaPlaneDeparture } from "react-icons/fa";

export default function SearchFlights() {
  const flightType = [
    { id: 0, name: "Return" },
    { id: 1, name: "One Way" },
    { id: 2, name: "Multi City" },
  ];
  return (
    <Card className="absolute z-40 top-[85%] md:top-[75%] -translate-x-1/2 -translate-y-1/2  left-[50%] w-[95vw] md:w-[70vw]">
      <div className="hidden md:flex gap-2 items-center border-b border-primary/30 py-2 px-6">
        <FaPlane className="size-4 md:size-6" />
        <h2 className="text-lg md:text-xl font-semibold">Flights</h2>
      </div>

      <CardContent className="p-0 md:py-2 md:px-6">
        <div className="flex  md:hidden gap-3 items-center w-full h-full">
          <span className="text-3xl w-10/12 border-r border-primary/30 py-3">
            Search Flights
          </span>
          <FaPlaneDeparture size={30} />
        </div>
        <div className="hidden md:flex justify-between items-center gap-2 my-[10px]">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-col items-center justify-self-start rounded-xl bg-foreground p-2">
              <span className="text-sm md:text-base text-secondary/80">
                Flight Type
              </span>
              <span className="text-xl md:text-2xl text-background">
                Return
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {flightType.map((type) => (
                <DropdownMenuItem key={type.id} asChild>
                  <span className="text-sm md:text-base">{type.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex justify-between w-auto"></div>
          <Button className="h-full m-0 flex items-center justify-center gap-2 p-2 w-auto">
            <FaPlaneDeparture size={28} />
            <span className="text-sm md:text-base">Search Flights</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
