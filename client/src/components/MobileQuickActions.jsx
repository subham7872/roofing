import React from 'react';

const MobileQuickActions = ({ onEmergencyClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 md:hidden flex h-16 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
      <a 
        href="tel:5550000000" 
        className="flex-1 flex flex-col items-center justify-center space-y-1 text-slate-900 border-r border-slate-100 active:bg-slate-50 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="text-[10px] font-medium uppercase tracking-tight">Call Dispatch</span>
      </a>
      
      <button 
        onClick={onEmergencyClick}
        className="flex-[2] flex flex-col items-center justify-center space-y-1 bg-red-600 text-white active:bg-red-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-[10px] font-medium uppercase tracking-tight">Emergency Help</span>
      </button>

      <a 
        href="https://goo.gl/maps" 
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center space-y-1 text-slate-900 border-l border-slate-100 active:bg-slate-50 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-[10px] font-medium uppercase tracking-tight">Location</span>
      </a>
    </div>
  );
};

export default MobileQuickActions;

