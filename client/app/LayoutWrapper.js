'use client'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DiscountModal from '../components/DiscountModal'
import { EmergencyProvider, useEmergency } from './EmergencyContext'

function LayoutContent({ children }) {
  const { setShowFunnel } = useEmergency()

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar onEmergencyClick={() => setShowFunnel(true)} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <DiscountModal />
    </div>
  )
}

export default function LayoutWrapper({ children }) {
  return (
    <EmergencyProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </EmergencyProvider>
  )
}
