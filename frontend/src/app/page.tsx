import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import WhatMovesSection from '../components/WhatMovesSection';
import SignalsSection from '../components/SignalsSection';
import TrendsSection from '../components/TrendsSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B1121]">
      <Navbar />
      <HeroSection />
      <WhatMovesSection />
      <SignalsSection />
      <TrendsSection />
      <Footer />
    </main>
  );
}