import React from 'react';

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
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .emergency-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EmergencyBanner;

