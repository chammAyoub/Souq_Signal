'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const footerLinks = {
  Product: ['Analytics Dashboard', 'Blog', 'Pricing', 'Contact', 'API Docs'],
  Company: ['About us', 'Careers', 'Press', 'Partners', 'Newsroom'],
  Resources: ['Documentation', 'Help center', 'Community', 'Status page', 'Support'],
  Legal: ['Privacy policy', 'Terms of service', 'Cookie settings', 'Compliance', 'Security'],
  Markets: ['Morocco tech trends', 'Automotive signals', 'Real estate insights', 'Market analysis', 'Trend forecasting'],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1a3535] text-white" ref={ref}>
      {/* Newsletter */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55 }}
        className="max-w-7xl mx-auto px-10 pt-14 pb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-white/10"
      >
        <div>
          <h3 className="text-xl font-bold mb-1">Stay ahead of trends</h3>
          <p className="text-sm text-gray-300">Get weekly market signals delivered to your inbox.</p>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto">
          {subscribed ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm text-green-400 font-medium py-2"
            >
              ✓ You&apos;re subscribed!
            </motion.p>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                className="px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-200 w-64"
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubscribe}
                className="px-5 py-2.5 text-sm font-semibold bg-white text-[#1a3535] rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </div>
          )}
          <p className="text-xs text-gray-400">By subscribing you agree to our Privacy Policy.</p>
        </div>
      </motion.div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-10 py-12 grid grid-cols-2 md:grid-cols-6 gap-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="col-span-1"
        >
          <span
            className="text-3xl text-white"
            style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", fontWeight: 700 }}
          >
            Logo
          </span>
        </motion.div>

        {Object.entries(footerLinks).map(([category, links], colIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + colIdx * 0.07, duration: 0.45 }}
          >
            <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="max-w-7xl mx-auto px-10 py-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400"
      >
        <span>© 2025 Souq Signal. All rights reserved.</span>
        <div className="flex items-center gap-6">
          {['Privacy policy', 'Terms of service', 'Cookie settings'].map((l) => (
            <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {[
            <path key="fb" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
          ].map(() => null)}
          {/* Facebook */}
          <motion.a href="#" whileHover={{ y: -2, color: '#fff' }} className="hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </motion.a>
          {/* Instagram */}
          <motion.a href="#" whileHover={{ y: -2 }} className="hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
          </motion.a>
          {/* X */}
          <motion.a href="#" whileHover={{ y: -2 }} className="hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </motion.a>
          {/* LinkedIn */}
          <motion.a href="#" whileHover={{ y: -2 }} className="hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </motion.a>
          {/* YouTube */}
          <motion.a href="#" whileHover={{ y: -2 }} className="hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </footer>
  );
}