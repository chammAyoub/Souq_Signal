'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// --- Counter hook ---
function useCountUp(target: number, duration = 1.4, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return count;
}

// --- Image placeholder ---
function ImagePlaceholder() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#1c2235]">
      <div className="w-20 h-16 bg-[#2a3147] rounded-xl flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-9 h-9 text-[#3d4a63]" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-1 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      </div>
    </div>
  );
}

// --- Stat card with counter ---
interface StatCardProps {
  prefix: string;
  value: number;
  suffix: string;
  title: string;
  subtitle: string;
  tall?: boolean;
  delay?: number;
}

function StatCard({ prefix, value, suffix, title, subtitle, tall, delay = 0 }: StatCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useCountUp(Math.abs(value), 1.2, inView);
  const display = `${prefix}${count}${suffix}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`flex flex-col justify-between p-6 border border-[#1e2640] bg-[#0d1526] cursor-default ${
        tall ? 'sm:row-span-2 min-h-[200px] sm:min-h-[400px]' : 'min-h-[160px] sm:min-h-[190px]'
      }`}
    >
      <span className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white leading-none tabular-nums">
        {display}
      </span>
      <div>
        <p className="text-white font-semibold text-base mb-1">{title}</p>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export default function WhatMovesSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  return (
    <section className="bg-[#0B1121] px-10 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-black text-white"
          >
            What moves right now
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-gray-400 text-base leading-relaxed self-end"
          >
            Three markets pulse with their own rhythm. Watch them shift in real time. The signals don&apos;t lie.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-2 gap-3">
          <StatCard prefix="+" value={12} suffix="%" title="Clio 4 demand surges" subtitle="Automotive buyers move fast here" tall delay={0} />

          {/* image top middle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-[160px] sm:min-h-[190px] flex border border-[#1e2640] bg-[#111827]"
          >
            <ImagePlaceholder />
          </motion.div>

          <StatCard prefix="+" value={5} suffix="%" title="Agadir studio rents climb" subtitle="Real estate pressure builds steady" delay={0.2} />

          <StatCard prefix="-" value={3} suffix="%" title="iPhone 13 margins contract" subtitle="Tech resale value shifts down" delay={0.15} />

          {/* image bottom right */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.25, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-[160px] sm:min-h-[190px] flex border border-[#1e2640] bg-[#111827]"
          >
            <ImagePlaceholder />
          </motion.div>
        </div>
      </div>
    </section>
  );
}