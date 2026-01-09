'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = ({ onEmergencyClick }) => {
  const [openDropdown, setOpenDropdown] = useState(null)
  const dropdownRefs = useRef({})
  const pathname = usePathname()

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach((key) => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          setOpenDropdown(null)
        }
      })
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const services = {
    plumbing: {
      title: 'Plumbing',
      href: '/plumbing',
      items: [
        { name: 'Emergency Plumbing', href: '/plumbing' },
        { name: 'Pipe Repair & Replacement', href: '/plumbing' },
        { name: 'Leak Detection & Repair', href: '/plumbing' },
        { name: 'Water Heater Services', href: '/plumbing' },
        { name: 'Drain Cleaning', href: '/plumbing' },
        { name: 'Sewer Line Repair', href: '/plumbing' },
        { name: 'Faucets & Fixtures', href: '/plumbing' },
        { name: 'Garbage Disposal', href: '/plumbing' }
      ]
    },
    hvac: {
      title: 'HVAC',
      href: '/hvac',
      items: [
        { name: 'AC Repair & Installation', href: '/hvac' },
        { name: 'Heating Services', href: '/hvac' },
        { name: 'Duct Cleaning', href: '/hvac' },
        { name: 'Air Quality Testing', href: '/hvac' },
        { name: 'Emergency HVAC Service', href: '/hvac' },
        { name: 'HVAC Maintenance', href: '/hvac' }
      ]
    },
    waterDamage: {
      title: 'Water Damage',
      href: '/water-damage',
      items: [
        { name: 'Water Extraction', href: '/water-damage' },
        { name: 'Flood Cleanup', href: '/water-damage' },
        { name: 'Structural Drying', href: '/water-damage' },
        { name: 'Mold Prevention', href: '/water-damage' },
        { name: 'Emergency Water Damage', href: '/water-damage' },
        { name: 'Water Damage Restoration', href: '/water-damage' }
      ]
    },
    emergency: {
      title: 'Emergency Services',
      href: '/emergency',
      items: [
        { name: '24/7 Emergency Response', href: '/emergency' },
        { name: 'Fire Damage Restoration', href: '/emergency' },
        { name: 'Storm Damage Repair', href: '/emergency' },
        { name: 'Sewage Cleanup', href: '/emergency' },
        { name: 'Board Up Services', href: '/emergency' },
        { name: 'Emergency Restoration', href: '/emergency' }
      ]
    }
  }

  const toggleDropdown = (service) => {
    setOpenDropdown(openDropdown === service ? null : service)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-medium text-white tracking-tight flex items-center">
                <span className="text-red-600 mr-1">RESTORE</span>PRO
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">
                Services • Est. 1998
              </span>
            </Link>
          </div>

          {/* Navigation with Dropdowns - Desktop */}
          <nav className="hidden lg:flex items-center space-x-2">
            {Object.entries(services).map(([key, service]) => (
              <div key={key} className="relative" ref={(el) => (dropdownRefs.current[key] = el)}>
                <div className="flex items-center">
                  <Link
                    href={service.href}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      pathname === service.href
                        ? 'text-red-500'
                        : 'text-white hover:text-red-500'
                    }`}
                  >
                    {service.title}
                  </Link>
                  <button
                    onClick={() => toggleDropdown(key)}
                    className="px-1 py-2 text-sm font-medium transition-colors text-white hover:text-red-500"
                    aria-label="Toggle dropdown"
                  >
                    <svg
                      className={`h-4 w-4 transition-transform ${openDropdown === key ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {openDropdown === key && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                    {service.items.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          pathname === item.href
                            ? 'bg-red-50 text-red-600 font-medium'
                            : 'text-slate-700 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Contact Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="hidden lg:block flex flex-col items-end">
              <span className="text-xs text-slate-400 uppercase font-medium tracking-wide">24/7 Response Line</span>
              <a href="tel:5550000000" className="text-lg font-medium text-white hover:text-red-500 transition-colors">
                (555) 000-0000
              </a>
            </div>
            <button 
              onClick={onEmergencyClick}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium text-sm transition-all transform hover:scale-105 shadow-lg shadow-red-900/20 active:scale-95 whitespace-nowrap"
            >
              EMERGENCY HELP
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <a href="tel:5550000000" className="flex items-center text-red-600 font-medium p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'mobile' ? null : 'mobile')}
              className="text-white p-2"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {openDropdown === 'mobile' && (
          <div className="lg:hidden border-t border-slate-800 py-4">
            {Object.entries(services).map(([key, service]) => (
              <div key={key} className="mb-2">
                <div className="flex items-center justify-between">
                  <Link
                    href={service.href}
                    className={`flex-1 text-left px-4 py-2 text-sm font-medium ${
                      pathname === service.href
                        ? 'text-red-500'
                        : 'text-white hover:text-red-500'
                    }`}
                  >
                    {service.title}
                  </Link>
                  <button
                    onClick={() => toggleDropdown(`mobile-${key}`)}
                    className="px-4 py-2 text-white"
                    aria-label="Toggle dropdown"
                  >
                    <svg
                      className={`h-4 w-4 transition-transform ${openDropdown === `mobile-${key}` ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {openDropdown === `mobile-${key}` && (
                  <div className="pl-4 mt-1 space-y-1">
                    {service.items.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          pathname === item.href
                            ? 'text-red-500 font-medium'
                            : 'text-slate-300 hover:text-red-500'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={onEmergencyClick}
              className="w-full mt-4 mx-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium text-sm"
            >
              EMERGENCY HELP
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
