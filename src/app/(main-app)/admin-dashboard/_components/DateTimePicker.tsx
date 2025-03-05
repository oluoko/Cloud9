import React, { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  dateFieldName: string;
  timeFieldName: string;
  dateFieldValue?: string;
  timeFieldValue?: string;
  dateFieldKey?: string;
  timeFieldKey?: string;
  dateFieldErrors?: string[];
  timeFieldErrors?: string[];
}

export function DateTimePicker({
  dateFieldName,
  timeFieldName,
  dateFieldValue,
  timeFieldValue,
  dateFieldKey,
  timeFieldKey,
  dateFieldErrors,
  timeFieldErrors,
}: DateTimePickerProps) {
  console.log("DateTimePicker Props:", {
    dateFieldName,
    timeFieldName,
    dateFieldValue,
    timeFieldValue,
    dateFieldKey,
    timeFieldKey,
    dateFieldErrors,
    timeFieldErrors,
  });

  // Generate time options
  const timeOptions = Array.from({ length: 96 }).map((_, i) => {
    const hour = Math.floor(i / 4)
      .toString()
      .padStart(2, "0");
    const minute = ((i % 4) * 15).toString().padStart(2, "0");
    return `${hour}:${minute}`;
  });

  // Ensure we always have a default time
  const defaultTime = timeOptions[0];

  const [date, setDate] = useState<Date | null>(
    dateFieldValue ? new Date(dateFieldValue) : null
  );

  const [time, setTime] = useState<string>(timeFieldValue || defaultTime);

  // Ensure hidden inputs always have a value
  useEffect(() => {
    console.log("Current Date:", date);
    console.log("Current Time:", time);
  }, [date, time]);

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4">
      <div className="flex flex-col gap-2">
        <Label>Flight Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {date ? format(date, "PPP") : "Select the date of the flight"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={date || undefined}
              onSelect={(selectedDate) => {
                setDate(selectedDate || null);
              }}
              fromYear={2000}
            />
          </PopoverContent>
        </Popover>

        {/* Hidden inputs with EXPLICIT values */}
        <input
          type="hidden"
          name={dateFieldName}
          value={date ? format(date, "yyyy-MM-dd") : ""}
          key={dateFieldKey}
          readOnly
        />

        {dateFieldErrors && (
          <div className="text-red-500 text-sm mt-1">
            {dateFieldErrors.join(", ")}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Flight Time</Label>
        <Select
          value={time}
          onValueChange={(newTime) => {
            setTime(newTime);
          }}
        >
          <SelectTrigger>
            <SelectValue>{time}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <input
              type="hidden"
              name={timeFieldName}
              value={timeOptions.includes(time) ? time : defaultTime}
              key={timeFieldKey}
              readOnly
            />
            <ScrollArea className="h-[15rem]">
              {timeOptions.map((timeOption) => (
                <SelectItem key={timeOption} value={timeOption}>
                  {timeOption}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>

        {timeFieldErrors && (
          <div className="text-red-500 text-sm mt-1">
            {timeFieldErrors.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
