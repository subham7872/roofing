'use client'

const EmergencyBanner = () => {
  return (
    <div className="bg-red-600 text-white text-[10px] md:text-xs font-medium py-2 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        <span className="mx-4 uppercase tracking-widest flex items-center inline-flex">
          <span className="w-2 h-2 bg-white rounded-full mr-2 emergency-pulse"></span>
          URGENT: Teams currently dispatched in Downtown area
        </span>
        <span className="mx-4 uppercase tracking-widest flex items-center inline-flex">
          <span className="w-2 h-2 bg-white rounded-full mr-2 emergency-pulse"></span>
          24/7 Water Extraction Units Standing By
        </span>
        <span className="mx-4 uppercase tracking-widest flex items-center inline-flex">
          <span className="w-2 h-2 bg-white rounded-full mr-2 emergency-pulse"></span>
          Free Insurance Consultation with Every Inspection
        </span>
        {/* Repeat for continuous look */}
        <span className="mx-4 uppercase tracking-widest flex items-center inline-flex">
          <span className="w-2 h-2 bg-white rounded-full mr-2 emergency-pulse"></span>
          URGENT: Teams currently dispatched in Downtown area
        </span>
      </div>
    </div>
  )
}

export default EmergencyBanner

