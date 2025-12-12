// ISD Logo Component - Production Ready
// This replaces figma:asset imports that don't work in Vercel production

import { Car } from 'lucide-react';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-xl flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
        <Car className="w-6 h-6 text-black" />
      </div>
      <span className="text-xl font-semibold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent">
        ISD Car Reservation
      </span>
    </div>
  );
}
