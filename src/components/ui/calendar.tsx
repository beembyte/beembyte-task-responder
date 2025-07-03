
import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalendarProps = {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | null) => void;
  disabled?: (date: Date) => boolean;
  mode?: "single";
  initialFocus?: boolean;
  onDateSelect?: (date: Date | undefined) => void;
};

function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  onDateSelect,
  ...props
}: CalendarProps) {
  const handleDateChange = (date: Date | null) => {
    if (onSelect) {
      onSelect(date);
    }
    if (onDateSelect) {
      onDateSelect(date || undefined);
    }
  };

  // Default disabled function to prevent past dates
  const isDateDisabled = (date: Date) => {
    if (disabled) {
      return disabled(date);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className={cn("p-3 pointer-events-auto", className)}>
      <DatePicker
        selected={selected}
        onChange={handleDateChange}
        filterDate={(date) => !isDateDisabled(date)}
        inline
        calendarClassName="border-0 shadow-none"
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex justify-between items-center px-2 py-2">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-medium">
              {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        {...props}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
