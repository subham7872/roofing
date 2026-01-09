'use client'

import { useContext } from 'react'
import { EmergencyContext } from '../app/EmergencyContext'

export function useEmergencySafe() {
  try {
    return useContext(EmergencyContext)
  } catch (e) {
    return null
  }
}
