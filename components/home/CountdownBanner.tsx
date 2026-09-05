'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function CountdownBanner() {
  const { locale } = useLanguage();

  const [timeLeft, setTimeLeft] = useState({
    days: 77,
    hours: 2,
    minutes: 30,
    seconds: 30,
  });

  useEffect(() => {
    const targetDate = new Date('2026-11-08T00:00:00Z').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-8 relative z-10 text-left">
      <div className="rounded-3xl bg-[#08090d]/80 border border-white/10 backdrop-blur-2xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[0_20px_70px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="space-y-1.5 text-center lg:text-left z-10">
          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 font-semibold">
            {locale === 'hi' ? 'जल्द ही लॉन्च हो रहा है' : "WE'RE LAUNCHING SOON"}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {locale === 'hi'
              ? 'कुछ असाधारण और शक्तिशाली आ रहा है।'
              : 'Something powerful is on the way.'}
          </h3>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 z-10">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINUTES', value: timeLeft.minutes },
            { label: 'SECONDS', value: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="w-16 sm:w-20 py-3 rounded-2xl bg-[#0d0e14]/90 border border-white/10 flex flex-col items-center justify-center shadow-inner"
            >
              <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
                {item.value < 10 ? `0${item.value}` : item.value}
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-neutral-400 mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CountdownBanner;