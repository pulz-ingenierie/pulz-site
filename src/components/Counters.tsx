'use client';

import { useEffect, useRef, useState } from 'react';

export type Stat = { valeur: number; suffixe?: string; label: string };

function formatFr(n: number, decimals: number) {
  return n.toFixed(decimals).replace('.', ',');
}

export default function Counters({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (reduce) {
      setRun(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setRun(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="brief-stats" ref={ref}>
      {stats.map((s, i) => (
        <StatItem key={i} stat={s} run={run} />
      ))}
    </div>
  );
}

function StatItem({ stat, run }: { stat: Stat; run: boolean }) {
  const decimals = Number.isInteger(stat.valeur) ? 0 : 1;
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!run) return;
    let raf = 0;
    let start: number | null = null;
    const dur = 1200;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(stat.valeur * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, stat.valeur]);

  return (
    <div className="s">
      <div className="big">
        {formatFr(val, decimals)}
        {stat.suffixe}
      </div>
      <div className="cap">{stat.label}</div>
    </div>
  );
}
