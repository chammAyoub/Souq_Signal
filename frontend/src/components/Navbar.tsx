'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['Dashboard', 'Analytics', 'Insights'];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`flex items-center justify-between py-3 px-10 bg-[#0B1121] sticky top-0 z-50 transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_4px_40px_rgba(0,0,0,0.6)]' : ''
        }`}
      >
        <div className="flex items-center gap-12">
          <Link href="/" className="cursor-pointer">
            <div className="flex items-center gap-2">
  <img 
    src="/logo-souq-signal.png" 
    alt="SouqSignal logo" 
    className="w-8 h-8 object-contain"
  />
  <span className="text-white font-semibold text-lg tracking-tight">
    SouqSignal
  </span>
</div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300 font-medium">
            {navLinks.map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
              >
                <Link href="#" className="hover:text-white transition-colors relative group">
                  {label}
                  {/* underline hover effect */}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.4 }}
              className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
            >
              <span>Resources</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="hidden md:flex items-center gap-3"
          >
            <button className="px-5 py-2 text-sm font-medium text-white border border-gray-600 rounded-lg hover:border-white hover:bg-white/5 transition-all duration-200">
              Sign in
            </button>
            <button className="px-5 py-2 text-sm font-semibold bg-white text-[#0B1121] rounded-lg hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-150">
              Start free
            </button>
          </motion.div>

          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Animated purple accent line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left' }}
        className="h-px bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 sticky top-[52px] z-50"
      />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="md:hidden bg-[#111827] border-b border-gray-800 overflow-hidden z-40"
          >
            <div className="flex flex-col p-6 gap-4">
              {['Dashboard', 'Analytics', 'Insights', 'Resources'].map((link) => (
                <Link key={link} href="#" className="text-gray-300 hover:text-white font-medium transition-colors">
                  {link}
                </Link>
              ))}
              <div className="h-px bg-gray-800 w-full my-1" />
              <button className="text-left text-gray-300 hover:text-white font-medium">Sign in</button>
              <button className="w-full px-5 py-3 text-sm bg-white text-[#0B1121] font-semibold rounded-lg hover:bg-gray-100">
                Start free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}