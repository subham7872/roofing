'use client'

import { useEmergencySafe } from '../hooks/useEmergencySafe'

const Hero = ({ onEmergencyClick }) => {
  const emergencyContext = useEmergencySafe()
  const handleEmergencyClick = onEmergencyClick || (emergencyContext ? () => emergencyContext.setShowFunnel(true) : undefined)

  return (
    <section className="relative bg-slate-900 text-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Content */}
          <div className="relative z-30 max-w-2xl h-[450px] lg:h-[500px] flex flex-col">
            <div className="inline-flex items-center space-x-2 bg-red-600/20 text-red-500 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-6 border border-red-500/30">
              <span className="flex h-2 w-2 rounded-full bg-red-600 emergency-pulse"></span>
              <span>24/7 Dispatch Active</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-6 text-white">
              Restoring Homes. <br />
              <span className="text-red-600">Rebuilding Peace.</span>
            </h1>
            
            <p className="text-lg text-slate-200 mb-10 leading-relaxed max-w-lg">
              Water, fire, or mold damage? Don't wait. We arrive in <span className="text-white font-medium underline decoration-red-600">60 minutes or less</span> to stop the damage and start the recovery.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={handleEmergencyClick}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-5 rounded-xl font-medium text-base transition-all shadow-2xl shadow-red-600/30 flex items-center justify-center space-x-3"
              >
                <span>EMERGENCY HELP NOW</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-8 py-5 rounded-xl font-medium text-base transition-all border border-white/20"
              >
                Get Free Inspection
              </button>
            </div>

            <div className="mt-12 flex items-center space-x-8">
              <div className="flex flex-col">
                <span className="text-white font-medium text-xl">4.9/5</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-medium">Google Reviews</span>
              </div>
              <div className="h-10 w-px bg-slate-700"></div>
              <div className="flex flex-col">
                <span className="text-white font-medium text-xl">60min</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-medium">Avg Response</span>
              </div>
              <div className="h-10 w-px bg-slate-700"></div>
              <div className="flex flex-col">
                <span className="text-white font-medium text-xl">100%</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-medium">Insurance Claims</span>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl z-10">
            <img
              src="/assets/hero.jpg"
              alt="Emergency Restoration Team"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                <p className="text-white font-medium text-sm mb-2">Trusted by 10,000+ Homeowners</p>
                <p className="text-white/80 text-xs">24/7 Emergency Response • Licensed & Insured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

