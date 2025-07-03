
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onDateSelect?: (date: Date | undefined) => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  disabled,
  onDateSelect,
  ...props
}: CalendarProps) {
  // Default disabled function to prevent past dates
  const defaultDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Combine user disabled prop with default disabled
  const combinedDisabled = disabled || defaultDisabled;

  // Handle date selection with auto-close
  const handleSelect = React.useCallback((selected: any) => {
    // Handle both single date and date range selections
    let dateToSelect: Date | undefined;
    
    if (selected instanceof Date) {
      dateToSelect = selected;
    } else if (selected && typeof selected === 'object' && 'from' in selected) {
      // Handle date range - use the 'from' date
      dateToSelect = selected.from;
    } else if (Array.isArray(selected) && selected.length > 0) {
      // Handle multiple dates - use the first one
      dateToSelect = selected[0];
    } else {
      dateToSelect = selected;
    }

    if (onDateSelect) {
      onDateSelect(dateToSelect);
    }
    
    // Call the original onSelect if provided
    if (props.onSelect) {
      props.onSelect(selected);
    }
  }, [onDateSelect, props.onSelect]);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      disabled={combinedDisabled}
      {...props}
      onSelect={handleSelect}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
