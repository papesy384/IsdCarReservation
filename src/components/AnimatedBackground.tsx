export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD700]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
    </div>
  );
}
