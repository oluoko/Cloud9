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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <span className="truncate">
                {date ? format(date, "PPP") : "Select the date of the flight"}
              </span>
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
              className="rounded-md border shadow"
              classNames={{
                month: "space-y-2 p-2",
                caption_label: "text-sm font-medium",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-xs font-normal text-muted-foreground w-8 h-8",
                row: "flex w-full",
                cell: "text-center text-sm relative p-0 focus-within:relative focus-within:z-20 h-8 w-8",
                day: "h-8 w-8 p-0 flex items-center justify-center rounded-md",
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_hidden: "invisible",
              }}
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
          <SelectTrigger className="w-full">
            <SelectValue>{time}</SelectValue>
          </SelectTrigger>
          <SelectContent position="popper" className="w-full min-w-[8rem]">
            <ScrollArea className="h-60 md:h-72">
              {timeOptions.map((timeOption) => (
                <SelectItem key={timeOption} value={timeOption}>
                  {timeOption}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
        <input
          type="hidden"
          name={timeFieldName}
          value={timeOptions.includes(time) ? time : defaultTime}
          key={timeFieldKey}
          readOnly
        />

        {timeFieldErrors && (
          <div className="text-red-500 text-sm mt-1">
            {timeFieldErrors.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
