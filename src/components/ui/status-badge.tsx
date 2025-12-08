import { CheckCircle, Clock, XCircle, Ban } from 'lucide-react';
import { Badge } from './badge';
import { cn } from './utils';
import { useTranslation } from 'react-i18next';

type BookingStatus = 'pending' | 'approved' | 'denied' | 'cancelled';
type TripStatus = 'upcoming' | 'in-progress' | 'completed';

interface StatusBadgeProps {
  status: BookingStatus | TripStatus;
  className?: string;
  language?: 'en' | 'fr'; // Keep for backward compatibility, but will use i18n if available
}

const statusLabels = {
  en: {
    pending: 'PENDING',
    approved: 'APPROVED',
    denied: 'DENIED',
    cancelled: 'CANCELLED',
    upcoming: 'UPCOMING',
    'in-progress': 'IN PROGRESS',
    completed: 'COMPLETED',
  },
  fr: {
    pending: 'EN ATTENTE',
    approved: 'APPROUVÉ',
    denied: 'REFUSÉ',
    cancelled: 'ANNULÉ',
    upcoming: 'À VENIR',
    'in-progress': 'EN COURS',
    completed: 'TERMINÉ',
  },
};

const bookingStatusConfig = {
  pending: {
    icon: Clock,
    className: 'bg-yellow-600 text-white hover:bg-yellow-700',
  },
  approved: {
    icon: CheckCircle,
    className: 'bg-green-600 text-white hover:bg-green-700',
  },
  denied: {
    icon: XCircle,
    className: 'bg-red-600 text-white hover:bg-red-700',
  },
  cancelled: {
    icon: Ban,
    className: 'bg-gray-600 text-white hover:bg-gray-700',
  },
  upcoming: {
    icon: Clock,
    className: 'bg-yellow-600 text-white hover:bg-yellow-700',
  },
  'in-progress': {
    icon: CheckCircle,
    className: 'bg-blue-600 text-white hover:bg-blue-700',
  },
  completed: {
    icon: CheckCircle,
    className: 'bg-green-600 text-white hover:bg-green-700',
  },
};

export function StatusBadge({ status, className, language }: StatusBadgeProps) {
  const { i18n } = useTranslation();
  const config = bookingStatusConfig[status];
  const Icon = config.icon;
  // Use i18n language if available, otherwise fall back to prop or 'en'
  const currentLanguage = (language || i18n.language || 'en') as 'en' | 'fr';
  const label = statusLabels[currentLanguage]?.[status] || statusLabels['en'][status];

  return (
    <Badge className={cn(config.className, 'flex items-center gap-1.5 px-3 py-1', className)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </Badge>
  );
}