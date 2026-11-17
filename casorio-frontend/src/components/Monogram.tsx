import React from 'react';

interface MonogramProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'burgundy' | 'ivory' | 'olive';
  className?: string;
}

export const Monogram: React.FC<MonogramProps> = ({
  size = 'md',
  variant = 'burgundy',
  className = '',
}) => {
  const dimensions = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-24 h-24 text-4xl',
  }[size];

  const colors = {
    burgundy: 'border-burgundy/25 text-burgundy bg-warmwhite/80',
    ivory: 'border-ivory/30 text-ivory bg-burgundy-dark/40',
    olive: 'border-olive/30 text-olive bg-warmwhite/80',
  }[variant];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full border ${dimensions} ${colors} font-serif select-none ${className}`}
      aria-label="Monograma Daniel e Yohana"
    >
      {/* Curva orgânica interna sutil */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        aria-hidden="true"
      >
        <path
          d="M 14 74 C 34 88, 68 88, 86 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M 18 28 C 38 12, 66 14, 84 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
      </svg>
      <span className="tracking-tight font-medium">
        D<span className="italic font-normal text-[0.72em] mx-0.5 opacity-80">&amp;</span>Y
      </span>
    </div>
  );
};
