import React from 'react';

/**
 * Grafismos botânicos autorais inspirados nas referências:
 * - Eucalipto (folhas arredondadas e alongadas em verde oliva/eucalipto)
 * - Antúrios bordô/vinho esculturais
 * - Copos-de-leite escuros e brancos
 * - Amaranto pendente e linhas curvas arquitetônicas (arcoondas.jpg)
 */

export const BotanicalCornerLeft: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 320 420"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    {/* Ondas arquitetônicas de tecido fluido (inspirado em arcoondas.jpg) */}
    <path
      d="M-20 390 C65 320, 45 140, 195 30 C235 0, 270 -10, 310 -15"
      stroke="#D8B8AF"
      strokeWidth="1.5"
      opacity="0.55"
    />
    <path
      d="M-30 350 C40 270, 80 180, 160 65"
      stroke="#621F2A"
      strokeWidth="1"
      opacity="0.22"
    />

    {/* Ramo de Eucalipto escultural */}
    <g className="animate-sway-slow origin-bottom-left">
      <path
        d="M10 380 Q65 240 145 120"
        stroke="#596044"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse cx="45" cy="295" rx="22" ry="12" transform="rotate(-38 45 295)" fill="#7E8C78" opacity="0.5" />
      <ellipse cx="78" cy="245" rx="25" ry="13" transform="rotate(-24 78 245)" fill="#596044" opacity="0.45" />
      <ellipse cx="62" cy="210" rx="20" ry="11" transform="rotate(-55 62 210)" fill="#7E8C78" opacity="0.6" />
      <ellipse cx="108" cy="185" rx="22" ry="11" transform="rotate(-18 108 185)" fill="#596044" opacity="0.5" />
      <ellipse cx="128" cy="142" rx="18" ry="9" transform="rotate(-32 128 142)" fill="#7E8C78" opacity="0.65" />

      {/* Antúrio Bordô Escultural (inspirado em flores.jpg) */}
      <path
        d="M88 265 C62 238, 75 198, 108 212 C140 198, 152 238, 118 268 C106 278, 98 276, 88 265 Z"
        fill="#621F2A"
        opacity="0.82"
      />
      <path
        d="M106 238 L128 214"
        stroke="#F5F0E8"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Amaranto pendente sutil */}
      <path
        d="M115 268 C118 305, 112 335, 120 365"
        stroke="#40151D"
        strokeWidth="2.5"
        strokeDasharray="3 5"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M124 272 C128 302, 124 328, 130 352"
        stroke="#621F2A"
        strokeWidth="2"
        strokeDasharray="2 4"
        strokeLinecap="round"
        opacity="0.5"
      />
    </g>
  </svg>
);

export const BotanicalCornerRight: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 320 420"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    {/* Curva de tecido drapeado (inspirado em arcoondas.jpg e floress.jpg) */}
    <path
      d="M340 40 C240 110, 260 280, 110 390"
      stroke="#D8B8AF"
      strokeWidth="1.5"
      opacity="0.55"
    />
    <path
      d="M340 90 C250 160, 220 260, 155 375"
      stroke="#596044"
      strokeWidth="1"
      opacity="0.3"
    />

    <g className="animate-sway-slow origin-top-right">
      {/* Copo-de-leite escuro (Calla Lily) e folhagem oliva */}
      <path
        d="M295 55 Q235 190 175 300"
        stroke="#596044"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse cx="255" cy="145" rx="24" ry="11" transform="rotate(35 255 145)" fill="#596044" opacity="0.45" />
      <ellipse cx="222" cy="198" rx="22" ry="11" transform="rotate(24 222 198)" fill="#7E8C78" opacity="0.55" />
      <ellipse cx="195" cy="248" rx="19" ry="9.5" transform="rotate(42 195 248)" fill="#596044" opacity="0.4" />

      {/* Copo-de-leite vinho escuro */}
      <path
        d="M225 145 C195 130, 185 168, 215 188 C238 202, 252 162, 225 145 Z"
        fill="#40151D"
        opacity="0.85"
      />
      <path
        d="M214 164 L196 152"
        stroke="#D8B8AF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export const ArchitecturalWaveBackdrop: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 1440 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full pointer-events-none select-none ${className}`}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M0 192 C320 96, 620 288, 980 160 C1210 78, 1350 138, 1440 112 L1440 320 L0 320 Z"
      fill="#EAE2D6"
      opacity="0.55"
    />
    <path
      d="M0 240 C420 150, 780 310, 1180 195 C1310 158, 1390 180, 1440 170 L1440 320 L0 320 Z"
      fill="#FCFAF6"
      opacity="0.9"
    />
    <path
      d="M0 180 C380 80, 680 280, 1080 140 C1260 78, 1380 120, 1440 96"
      stroke="#D8B8AF"
      strokeWidth="1.5"
      opacity="0.65"
    />
  </svg>
);
