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

function SignalItem({ insight, index, isActive, categoryCount }: SignalItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`py-10 border-t border-[#1e2640] group ${!isActive ? 'opacity-40 grayscale' : ''}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">Latest Top Signal</p>
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1e2640] text-gray-300 uppercase tracking-wider">
          {insight.categorie} {isActive && <span className="text-gray-500 ml-1">({categoryCount})</span>}
        </span>
        {isActive && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${insight.pourcentage.startsWith('-') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
            {insight.pourcentage}
          </span>
        )}
      </div>
      <h3 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight group-hover:text-gray-100 transition-colors">
        {insight.titreRapide}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xl">{insight.description}</p>
      
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
          View deal
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function SignalsSection() {
  const [signalData, setSignalData] = useState<{ insight: Insight; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/insights')
      .then(res => res.json())
      .then((data: Insight[]) => {
        const sortedData = [...data].sort((a, b) => b.id - a.id);

        const autoSignals = sortedData.filter(s => s.categorie === 'Auto');
        const immoSignals = sortedData.filter(s => s.categorie === 'Immo' || s.categorie === 'Real Estate');
        const techSignals = sortedData.filter(s => s.categorie === 'Tech' || s.categorie === 'PC');

        const latestAuto = autoSignals[0];
        const latestImmo = immoSignals[0];
        const latestTech = techSignals[0];

        const curated = [
          {
            insight: latestAuto || { id: 991, categorie: 'Auto', pourcentage: '', titreRapide: 'Scanning Auto Market...', description: 'Our AI pipeline is currently analyzing recent car listings.', dateCreation: '' },
            count: autoSignals.length
          },
          {
            insight: latestImmo || { id: 992, categorie: 'Immo', pourcentage: '', titreRapide: 'Real Estate integration pending', description: 'Coming soon: Real-time tracking of undervalued studio apartments.', dateCreation: '' },
            count: immoSignals.length
          },
          {
            insight: latestTech || { id: 993, categorie: 'Tech', pourcentage: '', titreRapide: 'Tech market monitoring', description: 'Coming soon: Detect margin slips in electronics.', dateCreation: '' },
            count: techSignals.length
          }
        ];

        setSignalData(curated);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-[#0B1121] px-6 sm:px-10 py-16">
      <div className="max-w-7xl mx-auto w-full">
        <div className="max-w-4xl w-full pl-4 sm:pl-12 md:pl-20">
          {loading ? (
            <p className="text-gray-500 text-sm pt-10">Loading signals...</p>
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
      </div>
    </section>
  );
}