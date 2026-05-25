'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const marketData = {
  Auto: [
    { date: '01 Mar', value: 8 }, { date: '05 Mar', value: 9 }, { date: '10 Mar', value: 7.5 },
    { date: '15 Mar', value: 11 }, { date: '20 Mar', value: 10 }, { date: '25 Mar', value: 13 },
    { date: '30 Mar', value: 14.5 }
  ],
  Immo: [
    { date: '01 Mar', value: 4 }, { date: '05 Mar', value: 4.5 }, { date: '10 Mar', value: 5 },
    { date: '15 Mar', value: 8 }, { date: '20 Mar', value: 7 }, { date: '25 Mar', value: 9 },
    { date: '30 Mar', value: 11 }
  ],
  Tech: [
    { date: '01 Mar', value: 12 }, { date: '05 Mar', value: 10 }, { date: '10 Mar', value: 11 },
    { date: '15 Mar', value: 14 }, { date: '20 Mar', value: 13 }, { date: '25 Mar', value: 15 },
    { date: '30 Mar', value: 13 }
  ]
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B1121] border border-[#1e2640] p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-white">
          +{payload[0].value}%
        </p>
        <p className="text-[#34d399] text-xs font-medium mt-1">Avg. Market Discount</p>
      </div>
    );
  }
  return null;
};

export default function TrendsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'Auto' | 'Immo' | 'Tech'>('Auto');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="bg-[#0B1121] px-6 sm:px-10 py-24" ref={ref}>
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-16 items-center">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="w-full xl:w-1/3 flex flex-col"
        >
          <p className="text-xs font-bold text-[#3b82f6] mb-4 tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse"></span>
            Market Intelligence
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            Thirty days of<br />market movement
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8">
            The curve shows the average profit margin (Hmiza depth) detected across the Moroccan market over the last 30 days. When the line goes up, buyers have the leverage.
          </p>

          <div className="flex items-center gap-4">
            <button className="px-6 py-3 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-all duration-300">
              Download Report
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="w-full xl:w-2/3 bg-[#0d1326] border border-[#1e2640] rounded-2xl p-6 md:p-8 shadow-2xl"
        >
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4 border-b border-[#1e2640] pb-6">
            <div className="flex gap-2 bg-[#131b31] p-1.5 rounded-xl border border-[#1e2640]">
              {(['Auto', 'Immo', 'Tech'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-[#3b82f6] text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current Margin ({activeTab})</p>
              <p className="text-3xl font-black text-white">
                +{marketData[activeTab][marketData[activeTab].length - 1].value}%
              </p>
            </div>
          </div>

          <div className="w-full h-[320px] md:h-[400px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData[activeTab]} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e2640" opacity={0.5} />

                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />

                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }} />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    fill="url(#colorValue)"
                    animationDuration={1500}
                    activeDot={{ r: 6, fill: '#0B1121', stroke: '#3b82f6', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}