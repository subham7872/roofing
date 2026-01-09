'use client'

import { useState } from 'react'
import { useEmergencySafe } from '../../hooks/useEmergencySafe'
import EmergencyBanner from '../../components/EmergencyBanner'
import MobileQuickActions from '../../components/MobileQuickActions'
import { ChatWidget } from '../../components/ChatWidget'

export default function EmergencyPage() {
  const [showFunnel, setShowFunnel] = useState(false)
  const emergencyContext = useEmergencySafe()
  const handleEmergencyClick = () => {
    if (emergencyContext) {
      emergencyContext.setShowFunnel(true)
    } else {
      setShowFunnel(true)
    }
  }

  return (
    <>
      <EmergencyBanner />
      
      {/* 1️⃣ Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-red-600/20 text-red-500 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-6 border border-red-500/30">
              <span className="flex h-2 w-2 rounded-full bg-red-600 emergency-pulse"></span>
              <span>24/7 Dispatch Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-6 text-white">
              Emergency <span className="text-red-600">Services</span>
            </h1>
            <p className="text-lg text-slate-200 mb-8 leading-relaxed">
              Available 24/7 for all emergency restoration needs. Fast response, professional service, peace of mind. We arrive in <span className="text-white font-medium underline decoration-red-600">60 minutes or less</span>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={handleEmergencyClick}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-5 rounded-xl font-medium text-base transition-all shadow-2xl shadow-red-600/30 flex items-center justify-center space-x-3"
              >
                <span>Get Emergency Help</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="text-slate-300 text-sm">
                <span className="font-medium">24/7 Response Line:</span> <a href="tel:5550000000" className="text-white hover:text-red-500 transition-colors">(555) 000-0000</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ Services Overview */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-xs font-medium text-red-500 uppercase tracking-widest mb-3">Our Services</h2>
            <h3 className="text-3xl font-medium text-white mb-2">Our Emergency Services</h3>
            <p className="text-slate-400 text-lg">
              Comprehensive emergency restoration for all disaster types. Fast response, professional service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="w-16 h-16 bg-red-600/10 rounded-xl flex items-center justify-center mb-6 text-3xl">
                🚨
              </div>
              <h3 className="text-lg font-medium text-white mb-3">24/7 Emergency Response</h3>
              <p className="text-slate-300 leading-relaxed text-base">
                Round-the-clock emergency response team ready to help when disaster strikes.
              </p>
            </div>
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="w-16 h-16 bg-red-600/10 rounded-xl flex items-center justify-center mb-6 text-3xl">
                🔥
              </div>
              <h3 className="text-lg font-medium text-white mb-3">Fire Damage Restoration</h3>
              <p className="text-slate-300 leading-relaxed text-base">
                Complete fire and smoke damage restoration services to restore your property.
              </p>
            </div>
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="w-16 h-16 bg-red-600/10 rounded-xl flex items-center justify-center mb-6 text-3xl">
                🌪️
              </div>
              <h3 className="text-lg font-medium text-white mb-3">Storm Damage Repair</h3>
              <p className="text-slate-300 leading-relaxed text-base">
                Expert storm damage assessment and repair services for all weather-related damage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3️⃣ Why Choose Us */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xs font-medium text-red-500 uppercase tracking-widest mb-3">Why Choose Us</h2>
            <h3 className="text-3xl font-medium text-white mb-8">Why Choose Us</h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-red-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">24/7 Dispatch</h3>
                  <p className="text-slate-300 text-base">Round-the-clock availability. We're always ready when you need us most.</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-red-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Insurance Direct Billing</h3>
                  <p className="text-slate-300">We work directly with your insurance company. No upfront costs for covered services.</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-red-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Certified Technicians</h3>
                  <p className="text-slate-300">Licensed, insured, and certified professionals with years of experience.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4️⃣ Final CTA */}
      <section className="bg-red-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-white text-lg font-medium text-center md:text-left">
              Need help now? We respond in under 60 minutes.
            </p>
            <a
              href="tel:5550000000"
              className="bg-white text-red-600 px-8 py-4 rounded-xl font-medium hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>

      <MobileQuickActions onEmergencyClick={handleEmergencyClick} />
      <ChatWidget />
    </>
  )
}
