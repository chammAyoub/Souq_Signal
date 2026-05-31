'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Insight {
  id: number;
  pourcentage: string;
  titreRapide: string;
  description: string;
  categorie: string;
  dateCreation: string;
}

interface SignalItemProps {
  insight: Insight;
  index: number;
  isActive: boolean;
  categoryCount: number;
}

// ── Category metadata ────────────────────────────────────────────────────────
function getCategoryMeta(categorie: string): { label: string; accent: string; icon: React.ReactNode } {
  const iconClass = "w-10 h-10";

  const autoIcon = (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 01-2-2v-4a2 2 0 012-2h1l2-4h10l2 4h1a2 2 0 012 2v4a2 2 0 01-2 2h-2" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="16.5" cy="17.5" r="2.5" />
    </svg>
  );

  const immoIcon = (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21v-6h6v6" />
      <rect x="9" y="10" width="2" height="3" />
      <rect x="13" y="10" width="2" height="3" />
    </svg>
  );

  const techIcon = (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );

  if (categorie === 'Auto')                                return { label: 'Auto',  accent: '#3b82f6', icon: autoIcon };
  if (categorie === 'Immo' || categorie === 'Real Estate') return { label: 'Immo',  accent: '#10b981', icon: immoIcon };
  if (categorie === 'Tech' || categorie === 'PC')          return { label: 'Tech',  accent: '#a78bfa', icon: techIcon };
  return { label: categorie, accent: '#3b82f6', icon: autoIcon };
}

function SignalItem({ insight, index, isActive }: SignalItemProps) {
  const { label, accent, icon } = getCategoryMeta(insight.categorie);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`grid grid-cols-1 sm:grid-cols-[240px_1fr] md:grid-cols-[280px_1fr] gap-0 py-10 ${
        !isActive ? 'opacity-35' : ''
      }`}
    >
      {/* Left column — radar icon, stretches to full row height then centers icon inside */}
      <div className="hidden sm:flex flex-col items-center justify-center h-full sm:pr-8 gap-3">
        {/* Pulse container */}
        <div className="relative flex items-center justify-center w-[180px] h-[180px]">

          {/* Animated rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                borderColor: accent,
                width: 80,
                height: 80,
              }}
              initial={{ opacity: 0.6, scale: 0.8 }}
              animate={{ opacity: 0, scale: 2.4 }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                delay: i * 0.85,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Icon circle */}
          <div
            className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full border"
            style={{
              backgroundColor: `${accent}12`,
              borderColor: `${accent}40`,
              color: accent,
            }}
          >
            {icon}
          </div>
        </div>

        {/* Category label */}
        <span
          className="text-[10px] font-bold tracking-[0.2em] uppercase"
          style={{ color: `${accent}99` }}
        >
          {label}
        </span>
      </div>

      {/* Right column — content */}
      <div className="min-w-0">
        {/* Top divider: short dash + long rule */}
        <div className="flex items-center mb-4">
          <span className="block w-8 h-[3px] bg-[#f5faf9] shrink-0" />
          <span className="block flex-1 h-[2px] bg-[#f5faf9]/20" />
        </div>

        {/* "Signal" label */}
        <p className="text-[13px] font-normal tracking-wide text-[#f5faf9] mb-3">
          Signal
        </p>

        {/* Title */}
        <h3
          className="font-black text-[#f5faf9] leading-[1.05] mb-3"
          style={{ fontSize: 'clamp(14px, 2.5vw, 35px)' }}
        >
          {insight.titreRapide}
        </h3>

        {/* Description */}
        <p className="text-[11px] leading-relaxed text-[#f5faf9] mb-8 max-w-xl">
          {insight.description}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 text-sm font-medium text-[#f5faf9] border border-[#f5faf9]/30 rounded-lg hover:border-[#ffffff]/60  transition-all"
          >
            Details
          </motion.button>
          <motion.button
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex items-center gap-1.5 text-sm font-medium text-[#f5faf9] hover:text-[#ebe8e8] transition-colors"
          >
            <span>Arrow</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function SignalsSection() {
  const [signalData, setSignalData] = useState<{ insight: Insight; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    fetch(`${apiUrl}/api/v1/insights`)
      .then(res => res.json())
      .then((data: Insight[]) => {
        const sortedData = [...data].sort((a, b) => b.id - a.id);

        const autoSignals  = sortedData.filter(s => s.categorie === 'Auto');
        const immoSignals  = sortedData.filter(s => s.categorie === 'Immo' || s.categorie === 'Real Estate');
        const techSignals  = sortedData.filter(s => s.categorie === 'Tech' || s.categorie === 'PC');

        const latestAuto = autoSignals[0];
        const latestImmo = immoSignals[0];
        const latestTech = techSignals[0];

        const curated = [
          {
            insight: latestAuto || {
              id: 991,
              categorie: 'Auto',
              pourcentage: '',
              titreRapide: 'Scanning Auto Market...',
              description: 'Our AI pipeline is currently analyzing recent car listings.',
              dateCreation: '',
            },
            count: autoSignals.length,
          },
          {
            insight: latestImmo || {
              id: 992,
              categorie: 'Immo',
              pourcentage: '',
              titreRapide: 'Real Estate integration pending',
              description: 'Coming soon: Real-time tracking of undervalued studio apartments.',
              dateCreation: '',
            },
            count: immoSignals.length,
          },
          {
            insight: latestTech || {
              id: 993,
              categorie: 'Tech',
              pourcentage: '',
              titreRapide: 'Tech market monitoring',
              description: 'Coming soon: Detect margin slips in electronics.',
              dateCreation: '',
            },
            count: techSignals.length,
          },
        ];

        setSignalData(curated);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: '#010911' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {loading ? (
          <p className="text-[#555] text-sm py-20 pl-[280px]">Loading signals...</p>
        ) : (
          signalData.map((item, i) => (
            <SignalItem
              key={item.insight.id}
              insight={item.insight}
              index={i}
              isActive={item.insight.id < 900}
              categoryCount={item.count}
            />
          ))
        )}
      </div>
    </section>
  );
}