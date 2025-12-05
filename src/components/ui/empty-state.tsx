import { LucideIcon } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 border border-[#FFD700]/30 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-[#FFD700]" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md mb-8">{description}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFA500] hover:to-[#FFD700] shadow-lg shadow-[#FFD700]/20"
          >
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button
            onClick={onSecondaryAction}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/5"
          >
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
