'use client'

import { createContext, useContext, useState } from 'react'
import EmergencyFunnel from '../components/EmergencyFunnel'

export const EmergencyContext = createContext()

export function EmergencyProvider({ children }) {
  const [showFunnel, setShowFunnel] = useState(false)

  return (
    <EmergencyContext.Provider value={{ showFunnel, setShowFunnel }}>
      {children}
      {showFunnel && (
        <EmergencyFunnel onClose={() => setShowFunnel(false)} />
      )}
    </EmergencyContext.Provider>
  )
}

export function useEmergency() {
  const context = useContext(EmergencyContext)
  if (!context) {
    throw new Error('useEmergency must be used within EmergencyProvider')
  }
  return context
}
