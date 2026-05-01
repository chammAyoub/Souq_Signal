'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function TrendsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-[#0B1121] px-10 py-16" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <p className="text-xs font-semibold text-gray-500 mb-3 tracking-widest uppercase">Trends</p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Thirty days of<br />market movement
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.12, duration: 0.55 }}
            className="flex flex-col justify-between gap-6"
          >
            <p className="text-gray-400 text-sm leading-relaxed">
              The line tells the story. Watch where the market bends and where it holds steady. These curves mean money.
            </p>
            <ul className="space-y-1.5 text-gray-300 text-sm">
              {['Automotive', 'Real estate', 'Tech'].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                  {item}
                </motion.li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-5 py-2.5 text-sm font-medium text-white border border-gray-600 rounded-lg hover:border-gray-400 transition-colors"
              >
                Reset
              </motion.button>
              <motion.button
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Export
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Chart placeholder — with subtle pulse */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-[480px] bg-[#0f1628] border border-[#1e2640] rounded-lg flex items-center justify-center relative overflow-hidden"
        >
          {/* Subtle shimmer line across the chart area */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'linear', repeatDelay: 1.5 }}
            className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          />
          <div className="w-32 h-28 bg-[#1c2235] rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-14 h-14 text-[#2e3a54]" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-1 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}