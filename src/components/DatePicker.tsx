import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  const [selected, setSelected] = useState<Date | undefined>(date);
  const [time, setTime] = useState('12:00');

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (selected) {
      const [hours, minutes] = newTime.split(':');
      const newDate = new Date(selected);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      onSelect(newDate);
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const [hours, minutes] = time.split(':');
      newDate.setHours(parseInt(hours), parseInt(minutes));
    }
    setSelected(newDate);
    onSelect(newDate);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-white shadow-lg border border-gray-100">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={handleDateSelect}
          className={cn(
            'mx-auto',
            '[&_.rdp-day_button:hover]:bg-pink-100',
            '[&_.rdp-day_button[aria-selected="true"]]:bg-pink-500',
            '[&_.rdp-day_button[aria-selected="true"]]:text-white',
            '[&_.rdp-day_button[aria-selected="true"]:hover]:bg-pink-600'
          )}
          classNames={{
            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-4',
            caption: 'flex justify-center pt-1 relative items-center',
            caption_label: 'text-sm font-medium',
            nav: 'space-x-1 flex items-center',
            nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
            row: 'flex w-full mt-2',
            cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-pink-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
            day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
            day_selected: 'bg-pink-500 text-white hover:bg-pink-500 hover:text-white focus:bg-pink-500 focus:text-white',
            day_today: 'bg-gray-100 text-gray-900',
            day_outside: 'text-gray-400 opacity-50',
            day_disabled: 'text-gray-400 opacity-50',
            day_range_middle: 'aria-selected:bg-pink-50 aria-selected:text-gray-900',
            day_hidden: 'invisible',
          }}
        />
      </div>
      <div className="flex items-center gap-2 p-4 rounded-lg bg-white shadow-lg border border-gray-100">
        <Clock className="h-5 w-5 text-gray-500" />
        <input
          type="time"
          value={time}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}