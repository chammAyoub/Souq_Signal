'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function useCountUp(target: number, duration = 1.6, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return count;
}

interface SignalItemProps {
  title: string;
  description: string;
  index: number;
}

function SignalItem({ title, description, index }: SignalItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="py-10 border-t border-[#1e2640] group"
    >
      <p className="text-xs font-semibold text-gray-500 mb-3 tracking-widest uppercase">Signal</p>
      <h3 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight group-hover:text-gray-100 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xl">{description}</p>
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="px-4 py-2 text-sm font-medium text-white border border-gray-600 rounded-md hover:border-gray-300 transition-colors"
        >
          Details
        </motion.button>
        <motion.button
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          Arrow
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}

const signals = [
  {
    title: 'Clio 4 demand moves fast',
    description: 'The Renault Clio 4 holds steady demand across Morocco. Buyers know what they want. The anomaly score climbs when supply tightens.',
  },
  {
    title: 'Agadir studio rentals climb steady',
    description: "Agadir's rental market feels the pressure. Studio apartments move faster now. The data shows what landlords already sense.",
  },
  {
    title: 'iPhone 13 resale margins slip',
    description: 'The iPhone 13 market softens. Resellers feel the margin squeeze. Older stock sits longer now. The trend is clear.',
  },
];

export default function SignalsSection() {
  const numRef = useRef(null);
  const inView = useInView(numRef, { once: true, margin: '-80px' });

  return (
    <section className="bg-[#0B1121] px-10 py-16">
      <div className="max-w-7xl mx-auto flex gap-12 md:gap-20">
        {/* Giant animated number */}
        <div ref={numRef} className="hidden md:flex items-start pt-8 shrink-0">
          <motion.span
            className="text-[140px] xl:text-[160px] font-black text-white leading-none select-none tabular-nums"
          >
            12
          </motion.span>
        </div>

        {/* Signal list */}
        <div className="flex-1">
          {signals.map((s, i) => (
            <SignalItem key={s.title} title={s.title} description={s.description} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}