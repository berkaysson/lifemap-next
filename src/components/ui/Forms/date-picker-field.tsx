import * as React from "react";
import { format, isToday } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../Buttons/button";
import { Iconify } from "../iconify";

interface DatePickerProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  showTodayButton?: boolean;
}

export function DatePicker({
  date,
  onSelect,
  showTodayButton = false,
}: DatePickerProps) {
  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate?.getTime() === date?.getTime() || !selectedDate) {
      onSelect(date);
    } else {
      onSelect(selectedDate);
    }
  };

  const isWithTodayButton = showTodayButton && date && !isToday(date);

  return (
    <div className="relative w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal bg-background",
              !date && "text-muted-foreground",
              isWithTodayButton && "pr-10"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {isWithTodayButton && (
        <div className="absolute right-0 top-0 h-full flex items-center pr-1 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSelect(new Date());
            }}
            title="Jump to today"
          >
            <Iconify icon="fluent:calendar-today-16-filled" width={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
