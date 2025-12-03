import { useState } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card } from './ui/card';

export interface DateRange {
  from: string;
  to: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
}

export function DateRangePicker({ value, onChange, placeholder = 'Select date range' }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ from: '', to: '' });
  };

  const hasValue = value.from || value.to;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20 ${
            !hasValue && 'text-gray-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-[#FFD700]" />
            {hasValue ? (
              <span>
                {value.from && formatDate(value.from)}
                {value.from && value.to && ' - '}
                {value.to && formatDate(value.to)}
              </span>
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          {hasValue && (
            <X
              className="h-4 w-4 text-gray-400 hover:text-white"
              onClick={clearDates}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-black/95 backdrop-blur-xl border-white/10" align="start">
        <Card className="border-0 bg-transparent">
          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">From Date</label>
              <input
                type="date"
                value={value.from}
                onChange={(e) => onChange({ ...value, from: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:border-[#FFD700]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">To Date</label>
              <input
                type="date"
                value={value.to}
                onChange={(e) => onChange({ ...value, to: e.target.value })}
                min={value.from}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:border-[#FFD700]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange({ from: '', to: '' });
                  setOpen(false);
                }}
                className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => setOpen(false)}
                className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90"
              >
                Apply
              </Button>
            </div>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
