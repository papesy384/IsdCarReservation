import { useState } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

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
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ from: '', to: '' });
    setIsExpanded(false);
  };

  const hasValue = value.from || value.to;

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsExpanded(true)}
        className={`w-full md:w-auto justify-between text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20 ${
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
            className="h-4 w-4 ml-2 text-gray-400 hover:text-white"
            onClick={clearDates}
          />
        )}
      </Button>
    );
  }

  return (
    <Card className="w-full md:w-auto p-4 bg-black/95 backdrop-blur-xl border-white/10">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-white">Date Range</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="from-date" className="text-sm text-gray-400 mb-1 block">From Date</Label>
            <Input
              id="from-date"
              type="date"
              value={value.from}
              onChange={(e) => onChange({ ...value, from: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div>
            <Label htmlFor="to-date" className="text-sm text-gray-400 mb-1 block">To Date</Label>
            <Input
              id="to-date"
              type="date"
              value={value.to}
              onChange={(e) => onChange({ ...value, to: e.target.value })}
              min={value.from}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onChange({ from: '', to: '' });
              setIsExpanded(false);
            }}
            className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            Clear
          </Button>
          <Button
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90"
          >
            Apply
          </Button>
        </div>
      </div>
    </Card>
  );
}
