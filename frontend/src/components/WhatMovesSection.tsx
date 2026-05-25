'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────
interface Insight {
  id: number;
  pourcentage: string;
  titreRapide: string;
  description: string;
  categorie: string;
  dateCreation: string;
}

// ─── Helpers ─────────────────────────────────────────────
const CATEGORIES = ['Auto', 'Tech', 'Immo'] as const;

const FALLBACKS: Record<string, Insight> = {
  Auto: { id: 91, categorie: 'Auto', pourcentage: '+12%', titreRapide: 'Clio 4 demand surges', description: 'Automotive buyers move fast. Anomaly score climbs when supply tightens.', dateCreation: '' },
  Tech: { id: 92, categorie: 'Tech', pourcentage: '-3%',  titreRapide: 'iPhone 13 margins slip',    description: 'The iPhone 13 market softens. Resellers feel the margin squeeze.',          dateCreation: '' },
  Immo: { id: 93, categorie: 'Immo', pourcentage: '+5%',  titreRapide: 'Agadir studio rents climb', description: 'Real estate pressure builds steady. Studio apartments move faster now.',    dateCreation: '' },
};

function pickOneMacroPerCategory(data: Insight[]): Insight[] {
  const macroOnly = data.filter(
    (item) => !item.titreRapide.toLowerCase().includes('hmiza')
  );

  return CATEGORIES.map((cat) => {
    const match = macroOnly.find(
      (s) => s.categorie === cat || (cat === 'Immo' && s.categorie === 'Real Estate') || (cat === 'Tech' && s.categorie === 'PC')
    );
    return match ?? FALLBACKS[cat];
  });
}

// ─── Counter hook ─────────────────────────────────────────
function useCountUp(target: number, duration = 1.4, inView = false) {
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

// ─── Image Component Jdid ─────────────────────────────────
function BentoImage({ src, alt }: { src: string; alt: string }) {
  return (
    // 7iydna bg-white w padding bach tswira t3mer lblassa kamla
    <div className="w-full h-full relative group overflow-hidden">
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────
interface StatCardProps {
  insight: Insight;
  delay?: number;
}

function StatCard({ insight, delay = 0 }: StatCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const raw = insight.pourcentage.replace('%', '').replace('+', '');
  const numericValue = Math.abs(parseFloat(raw) || 0);
  const count = useCountUp(numericValue, 1.2, inView);
  const isNegative = insight.pourcentage.startsWith('-');
  const display = `${isNegative ? '-' : '+'}${count}%`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="flex flex-col justify-between p-6 border border-[#334155] rounded-lg bg-[#111827] shadow-lg shadow-black/40 cursor-default min-h-[160px] sm:min-h-[190px]"
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black leading-none tabular-nums ${
            isNegative ? 'text-red-400' : 'text-white'
          }`}
        >
          {display}
        </span>
        <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase mt-1">
          {insight.categorie}
        </span>
      </div>
      <div>
        <p className="text-white font-semibold text-base mb-1">{insight.titreRapide}</p>
        <p className="text-gray-400 text-sm">{insight.description}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────
export default function WhatMovesSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    fetch(`${apiUrl}/api/v1/insights/dashboard`)
      .then((res) => res.json())
      .then((data: Insight[]) => {
        setInsights(pickOneMacroPerCategory(data));
        setLoading(false);
      })
      .catch(() => {
        setInsights(CATEGORIES.map((cat) => FALLBACKS[cat]));
        setLoading(false);
      });
  }, []);

  const [auto, tech, immo] = insights;

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
        {loading ? (
          <div className="text-gray-500 text-sm">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-2 gap-3">

            {/* ─── ROW 1 ─── */}
            
            {/* Col 1, Row 1: Auto Card */}
            {auto && <StatCard insight={auto} delay={0} />}

            {/* Col 2, Row 1: Immo Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.1, duration: 0.55 }}
              className="min-h-[160px] sm:min-h-[190px] flex border border-[#1e2640] rounded-lg overflow-hidden"
            >
              <BentoImage src="/immo.jpg" alt="Real Estate Market" />
            </motion.div>

            {/* Col 3, Row 1: Tech Card */}
            {tech && <StatCard insight={tech} delay={0.2} />}


            {/* ─── ROW 2 ─── */}
            
            {/* Col 1, Row 2: Auto Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.15, duration: 0.55 }}
              className="min-h-[160px] sm:min-h-[190px] flex border border-[#1e2640] rounded-lg overflow-hidden"
            >
              <BentoImage src="/auto.jpg" alt="Auto Market" />
            </motion.div>

            {/* Col 2, Row 2: Immo Card */}
            {immo && <StatCard insight={immo} delay={0.25} />}

            {/* Col 3, Row 2: Tech Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.3, duration: 0.55 }}
              className="min-h-[160px] sm:min-h-[190px] flex border border-[#1e2640] rounded-lg overflow-hidden"
            >
              <BentoImage src="/tech.jpg" alt="Tech Market" />
            </motion.div>

          </div>
        )}
      </div>
    </section>
  );
}