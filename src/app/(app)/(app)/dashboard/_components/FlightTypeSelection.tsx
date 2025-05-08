import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FlightTypes {
  id: number;
  value: string;
  name: string;
}

export default function FlightTypeSelection({
  flightType,
}: {
  flightType: FlightTypes[];
}) {
  return (
    <Select>
      <SelectTrigger className="w-[150px] h-[70px] rounded-xl">
        <div className="flex flex-col items-start justify-self-start rounded-xl p-2">
          <span className="text-sm text-foreground/50">Flight Type</span>
          <SelectValue className="text-lg md:text-xl" />
        </div>
      </SelectTrigger>
      <SelectContent align="end">
        {flightType.map((type) => (
          <SelectItem key={type.id} value={type.value}>
            <span className="text-lg md:text-xl">{type.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
