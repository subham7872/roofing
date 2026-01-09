'use client'

import { useState } from 'react'
import Hero from '../components/Hero'
import Services from '../components/Services'
import HowItWorks from '../components/HowItWorks'
import TrustSection from '../components/TrustSection'
import BeforeAfter from '../components/BeforeAfter'
import InsuranceSection from '../components/InsuranceSection'
import EmergencyBanner from '../components/EmergencyBanner'
import MobileQuickActions from '../components/MobileQuickActions'
import { ChatWidget } from '../components/ChatWidget'
import { ChatbotWidget } from '../components/ChatbotWidget'

export default function HomeClient() {
  const [showFunnel, setShowFunnel] = useState(false)

  return (
    <>
      <EmergencyBanner />
      <Hero onEmergencyClick={() => setShowFunnel(true)} />
      <TrustSection />
      <Services />
      <HowItWorks />
      <BeforeAfter />
      <InsuranceSection onEmergencyClick={() => setShowFunnel(true)} />
      <MobileQuickActions onEmergencyClick={() => setShowFunnel(true)} />
      <ChatbotWidget />
    </>
  )
}
