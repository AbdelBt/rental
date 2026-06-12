import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-2 [--cell-radius:var(--radius)] [--cell-size:2rem] bg-card/95 text-foreground dark:bg-dark-bg",
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months,
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[--cell-size] p-0 select-none text-foreground/60 hover:text-foreground hover:bg-muted aria-disabled:opacity-30 border border-border bg-background",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[--cell-size] p-0 select-none text-foreground/60 hover:text-foreground hover:bg-muted aria-disabled:opacity-30 border border-border bg-background",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption,
        ),
        caption_label: cn(
          "text-sm font-semibold text-foreground select-none",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 text-[0.8rem] font-normal text-foreground/50 select-none text-center",
          defaultClassNames.weekday,
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-[--cell-radius] p-0 text-center select-none text-foreground/80 hover:text-foreground hover:bg-muted",
          "[&:last-child[data-selected=true]_button]:rounded-r-[--cell-radius]",
          "[&:first-child[data-selected=true]_button]:rounded-l-[--cell-radius]",
          defaultClassNames.day,
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-[--cell-radius] bg-[#d4a853]/15",
          "after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-[#d4a853]/15",
          defaultClassNames.range_start,
        ),
        range_middle: cn(
          "rounded-none bg-[#d4a853]/15",
          defaultClassNames.range_middle,
        ),
        range_end: cn(
          "relative isolate z-0 rounded-r-[--cell-radius] bg-[#d4a853]/15",
          "after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-[#d4a853]/15",
          defaultClassNames.range_end,
        ),
        today: cn(
          "rounded-[--cell-radius] bg-border/10 text-foreground font-semibold",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-foreground/40 aria-selected:text-foreground/50",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "text-foreground/40 opacity-50",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className: cls, rootRef, ...p }) => (
          <div data-slot="calendar" ref={rootRef} className={cn(cls)} {...p} />
        ),
        Chevron: ({ className: cls, orientation, ...p }) => {
          if (orientation === "left")
            return <ChevronLeft className={cn("size-4", cls)} {...p} />;
          if (orientation === "right")
            return <ChevronRight className={cn("size-4", cls)} {...p} />;
          return <ChevronDown className={cn("size-4", cls)} {...p} />;
        },
        DayButton: (p) => <CalendarDayButton locale={locale} {...p} />,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({ className, day, modifiers, locale, ...props }) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-[--cell-size] flex-col gap-1 border-0 leading-none font-normal",
        "text-foreground/80 hover:bg-muted hover:text-foreground",
        "data-[selected-single=true]:bg-[#d4a853] data-[selected-single=true]:text-[#0a0a0f] data-[selected-single=true]:font-bold",
        "data-[range-start=true]:rounded-l-[--cell-radius] data-[range-start=true]:bg-[#d4a853] data-[range-start=true]:text-[#0a0a0f] data-[range-start=true]:font-bold",
        "data-[range-end=true]:rounded-r-[--cell-radius] data-[range-end=true]:bg-[#d4a853] data-[range-end=true]:text-[#0a0a0f] data-[range-end=true]:font-bold",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-foreground",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
