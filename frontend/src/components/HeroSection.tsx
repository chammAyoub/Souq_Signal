'use client';

import { motion } from 'framer-motion';

const words = ['Market', 'intelligence', 'live'];

export default function HeroSection() {
  return (
    <section className="bg-[#0B1121] px-10 py-20 min-h-[520px] flex items-center relative overflow-hidden">
      
      {/* Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-indigo-600 blur-[120px]"
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* LEFT */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold text-gray-400 mb-4 tracking-widest uppercase"
          >
            Signal
          </motion.p>

          <h1 className="text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight">
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + i * 0.08,
                  duration: 0.45,
                  ease: 'easeOut',
                }}
                className="block"
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-col gap-8"
        >
          <p className="text-gray-300 text-lg leading-relaxed max-w-sm">
            The data flows in real time. Three markets. One dashboard.
            Everything you need to move before the crowd does.
          </p>

          <div className="flex items-center gap-3">
            <button className="px-6 py-3 text-sm font-semibold bg-white text-[#0B1121] rounded-lg hover:bg-gray-100 transition">
              Search
            </button>
            <button className="px-6 py-3 text-sm font-semibold text-white border border-gray-500 rounded-lg transition">
              Profile
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}