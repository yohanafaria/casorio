import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetIsoDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeLeft(targetIso: string): TimeLeft {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPast: false,
  };
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetIsoDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetIsoDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetIsoDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetIsoDate]);

  if (timeLeft.isPast) {
    return (
      <div className="text-center py-6">
        <p className="font-serif text-3xl text-burgundy italic">
          Chegou o grande dia de celebrar nosso encontro!
        </p>
      </div>
    );
  }

  const units = [
    { label: 'Dias', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ];

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
      role="timer"
      aria-label="Contagem regressiva para o casamento"
    >
      {units.map((unit) => (
        <div
          key={unit.label}
          className="px-5 py-6 rounded-organic bg-warmwhite/90 border border-blush/45 text-center transition-transform hover:-translate-y-0.5"
        >
          <span className="block font-serif text-4xl sm:text-5xl text-burgundy font-medium tracking-tight">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="mt-1 block text-[11px] uppercase tracking-[0.22em] text-olive font-medium">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};
