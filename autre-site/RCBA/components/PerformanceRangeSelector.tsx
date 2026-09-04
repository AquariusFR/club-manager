'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PerformanceRangeSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get('days') || '14';

  const ranges = [
    { label: '7 JOURS', value: '7' },
    { label: '14 JOURS', value: '14' },
    { label: '30 JOURS', value: '30' }
  ];

  const handleRangeChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('days', val);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      {ranges.map((r) => (
        <button
          key={r.value}
          onClick={() => handleRangeChange(r.value)}
          className={`px-4 py-2 rounded-xl border text-[8px] font-black uppercase tracking-widest italic transition ${
            currentRange === r.value
              ? 'bg-blue-500/20 border-blue-500/50 text-white'
              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
