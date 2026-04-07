import * as React from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button"; // ✅ FIXED PATH

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: "flex flex-col md:flex-row gap-4",
        month: "flex flex-col gap-4",
        nav: "flex justify-between items-center",
        table: "w-full border-collapse",
        weekdays: "flex",
        weekday: "flex-1 text-xs text-gray-500 text-center",
        week: "flex w-full mt-2",
        day: "flex-1 text-center",
        today: "bg-gray-200 rounded",
        selected: "bg-blue-600 text-white rounded",
        outside: "text-gray-400",
        disabled: "opacity-50",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="w-4 h-4" />;
          }
          if (orientation === "right") {
            return <ChevronRight className="w-4 h-4" />;
          }
          return <ChevronDown className="w-4 h-4" />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn(
        "w-10 h-10 p-0 text-sm hover:bg-gray-200",
        modifiers.selected && "bg-blue-600 text-white",
        className
      )}
      {...props}
    >
      {day.date.getDate()}
    </Button>
  );
}

export { Calendar, CalendarDayButton };