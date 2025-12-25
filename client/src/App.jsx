import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import TrustSection from './components/TrustSection';
import BeforeAfter from './components/BeforeAfter';
import InsuranceSection from './components/InsuranceSection';
import EmergencyFunnel from './components/EmergencyFunnel';
import Footer from './components/Footer';
import EmergencyBanner from './components/EmergencyBanner';
import MobileQuickActions from './components/MobileQuickActions';
import { ChatWidget } from './components/ChatWidget';
import './App.css';

function App() {
  const [showFunnel, setShowFunnel] = useState(false);

  // Auto-trigger funnel or offer after delay to increase conversion
  useEffect(() => {
    const timer = setTimeout(() => {
      // Potentially show a nudge here
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <EmergencyBanner />
      <Header onEmergencyClick={() => setShowFunnel(true)} />
      
      <main className="flex-grow">
        <Hero onEmergencyClick={() => setShowFunnel(true)} />
        <TrustSection />
        <Services />
        <BeforeAfter />
        <InsuranceSection onEmergencyClick={() => setShowFunnel(true)} />
      </main>

      <Footer />

      {/* Emergency Modal Funnel */}
      {showFunnel && (
        <EmergencyFunnel onClose={() => setShowFunnel(false)} />
      )}

      {/* Persistent Phone CTA for Mobile */}
      <MobileQuickActions onEmergencyClick={() => setShowFunnel(true)} />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
