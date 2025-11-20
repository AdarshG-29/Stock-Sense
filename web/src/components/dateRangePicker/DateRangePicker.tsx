"use client"

import { useMemo, useState } from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateRange } from "react-day-picker"

type DateRangePickerProps = {
  value: DateRange
  onChange: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const DateRangePicker = ({
  value,
  onChange,
  placeholder = "Pick a date range",
  className,
  disabled,
}: DateRangePickerProps) => {
  const [internalRange, setInternalRange] = useState<DateRange | undefined>(
    value ?? {
      from: new Date(),
      to: addDays(new Date(), 7),
    }
  )
  const [open, setOpen] = useState(false)

  const range = value ?? internalRange

  const handleSelect = (selected: DateRange | undefined) => {
    setInternalRange(selected)
    onChange?.(selected)
  }

  const label = useMemo(() => {
    if (range?.from && range?.to) {
      return `${format(range.from, "PPP")} - ${format(range.to, "PPP")}`
    }
    if (range?.from) {
      return format(range.from, "PPP")
    }
    return placeholder
  }, [range, placeholder])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "justify-start text-left font-bold text-sm text-gray-500",
            !range?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 " />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
      >
        <Calendar
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}

export default DateRangePicker