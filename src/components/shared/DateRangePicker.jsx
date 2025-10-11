// src/components/shared/DateRangePicker.jsx

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
}) {
  const [range, setRange] = useState(
    value || { from: undefined, to: undefined }
  );

  const handleSelect = (selectedRange) => {
    setRange(selectedRange);
    onChange?.(selectedRange);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[180px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range.from ? (
            range.to ? (
              <>
                {format(range.from, "MMM d, yyyy")} -{" "}
                {format(range.to, "MMM d, yyyy")}
              </>
            ) : (
              format(range.from, "MMM d, yyyy")
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={range}
          onSelect={handleSelect}
          className="rounded-md border shadow-sm"
        />
      </PopoverContent>
    </Popover>
  );
}
