import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
    label: string
    value?: string
    onChange: (value: string | undefined) => void
    error?: string
}

export default function DatePickerField({ label, value, onChange, error }: Props) {
    const [open, setOpen] = useState(false)

    const selected = value ? parseISO(value) : undefined

    const handleSelect = (date: Date | undefined) => {
        onChange(date ? format(date, 'yyyy-MM-dd') : undefined)
        setOpen(false)
    }

    return (
        <div className="p-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-stone-200">{label}</label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "h-8 w-full justify-start gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm font-normal text-stone-200 hover:bg-white/[0.04] hover:text-stone-200",
                            !selected && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="size-3.5 shrink-0 text-stone-400" />
                        {selected ? format(selected, 'dd MMM yyyy') : 'Pick a date'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selected}
                        onSelect={handleSelect}
                        disabled={{ before: new Date() }}
                        captionLayout="dropdown"
                    />
                </PopoverContent>
            </Popover>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    )
}
