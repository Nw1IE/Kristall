import React from 'react';

export const CrystalIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Crystal cluster inspired by the official Kristall logo */}
    <path d="M24 2L34 16L24 46L14 16L24 2Z" fill="url(#grad_main)" />
    <path d="M24 2L14 16L24 24L34 16L24 2Z" fill="url(#grad_top)" opacity="0.9" />
    <path d="M14 16L6 22L24 46L14 16Z" fill="url(#grad_left)" />
    <path d="M34 16L42 22L24 46L34 16Z" fill="url(#grad_right)" />
    <path d="M24 24L14 16L6 22L24 46L24 24Z" fill="url(#grad_facet1)" opacity="0.6" />
    <path d="M24 24L34 16L42 22L24 46L24 24Z" fill="url(#grad_facet2)" opacity="0.4" />
    
    <defs>
      <linearGradient id="grad_main" x1="24" y1="2" x2="24" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="0.5" stopColor="#2563EB" />
        <stop offset="1" stopColor="#1E3A8A" />
      </linearGradient>
      <linearGradient id="grad_top" x1="14" y1="2" x2="34" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#93C5FD" />
        <stop offset="1" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="grad_left" x1="6" y1="16" x2="24" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1D4ED8" />
        <stop offset="1" stopColor="#172554" />
      </linearGradient>
      <linearGradient id="grad_right" x1="42" y1="16" x2="24" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="grad_facet1" x1="6" y1="16" x2="24" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="grad_facet2" x1="42" y1="16" x2="24" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#93C5FD" />
        <stop offset="1" stopColor="#1E40AF" />
      </linearGradient>
    </defs>
  </svg>
);

export const KristallHeaderBadge: React.FC<{ subtitle?: boolean }> = ({ subtitle = true }) => (
  <div className="flex items-center gap-3">
    <div className="p-1.5 rounded-2xl bg-blue-950/60 border border-blue-500/30 shadow-lg shadow-blue-500/10 flex items-center justify-center">
      <CrystalIcon size={34} />
    </div>
    <div>
      <div className="text-xl font-black text-white tracking-wide font-sans flex items-center gap-2">
        <span className="text-blue-400">«Кристалл»</span>
        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
          CRM
        </span>
      </div>
      {subtitle && (
        <div className="text-[11px] text-slate-400 leading-tight">
          Изготовление памятников, надгробий, комплексов и оград
        </div>
      )}
    </div>
  </div>
);
