import { CheckCircle, Clock, XCircle, Ban } from 'lucide-react';
import { Badge } from './badge';
import { cn } from './utils';

type BookingStatus = 'pending' | 'approved' | 'denied' | 'cancelled';
type TripStatus = 'upcoming' | 'in-progress' | 'completed';

interface StatusBadgeProps {
  status: BookingStatus | TripStatus;
  className?: string;
}

const bookingStatusConfig = {
  pending: {
    label: 'PENDING',
    icon: Clock,
    className: 'bg-yellow-600 text-white hover:bg-yellow-700',
  },
  approved: {
    label: 'APPROVED',
    icon: CheckCircle,
    className: 'bg-green-600 text-white hover:bg-green-700',
  },
  denied: {
    label: 'DENIED',
    icon: XCircle,
    className: 'bg-red-600 text-white hover:bg-red-700',
  },
  cancelled: {
    label: 'CANCELLED',
    icon: Ban,
    className: 'bg-gray-600 text-white hover:bg-gray-700',
  },
  upcoming: {
    label: 'UPCOMING',
    icon: Clock,
    className: 'bg-yellow-600 text-white hover:bg-yellow-700',
  },
  'in-progress': {
    label: 'IN PROGRESS',
    icon: CheckCircle,
    className: 'bg-blue-600 text-white hover:bg-blue-700',
  },
  completed: {
    label: 'COMPLETED',
    icon: CheckCircle,
    className: 'bg-green-600 text-white hover:bg-green-700',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = bookingStatusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={cn(config.className, 'flex items-center gap-1.5 px-3 py-1', className)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </Badge>
  );
}