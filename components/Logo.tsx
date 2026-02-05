import React from 'react';

export const WinprovitLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Image */}
      <img 
        src="/winprovit-logo.png" 
        alt="Winprovit Logo" 
        width={40} 
        height={40} 
        className="flex-shrink-0"
      />
      
      {/* Text Logo */}
      <div className="flex flex-col justify-center leading-none">
        <span className="font-bold text-2xl tracking-wide text-black">
          WINPROVIT
        </span>
        <span className="text-[0.65rem] font-bold text-winprovit-red tracking-[0.2em] uppercase">
          We Improve It
        </span>
      </div>
    </div>
  );
};

export const WinprovitIcon: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
             <path d="M10 10 L35 90 L50 50 L65 90 L90 10" stroke="#D50000" strokeWidth="15" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    )
}
