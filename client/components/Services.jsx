'use client'

import { useState, useEffect } from 'react'
import { getServices } from '../services/api'

// Fallback icons mapping
const iconMap = {
  "Water Damage Restoration": "💧",
  "Fire & Smoke Damage": "🔥",
  "Mold Remediation": "🍄",
  "Storm & Flood Recovery": "🌪️",
  "Sewage Cleanup": "☣️",
  "Structural Drying": "🌬️"
}

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices()
        setServices(data)
      } catch (error) {
        console.error('Error loading services:', error)
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <section id="services" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-300">Loading services...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-xs font-medium text-red-500 uppercase tracking-widest mb-3">Our Expertise</h2>
          <p className="text-3xl font-medium text-white mb-2">Complete Restoration Solutions</p>
          <p className="text-slate-400">Professional restoration services for all your emergency needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length > 0 ? services.map((service, idx) => (
            <div key={service._id || idx} className="group relative bg-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-700">
              <div className="h-48 overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg w-12 h-12 flex items-center justify-center text-xl shadow-lg">
                  {iconMap[service.title] || "🔧"}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-lg font-medium mb-3 text-white">{service.title}</h3>
                <p className="text-slate-300 leading-relaxed mb-6">{service.description}</p>
                <a href="#" className="text-red-500 font-medium flex items-center hover:translate-x-1 transition-transform">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-300">No services available. Please add services via API.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Services

