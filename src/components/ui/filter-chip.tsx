import { X } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

export function FilterChip({ label, onRemove, className }: FilterChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/30 text-[#FFD700] text-sm font-medium transition-all hover:bg-[#FFD700]/30",
        className
      )}
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-[#FFD700]/20 rounded-full p-0.5 transition-colors"
        aria-label={`Remove filter: ${label}`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

