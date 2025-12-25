import React from 'react';

const Header = ({ onEmergencyClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex flex-col">
              <span className="text-xl font-medium text-white tracking-tight flex items-center">
                <span className="text-red-600 mr-1">RESTORE</span>PRO
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">
                Services • Est. 1998
              </span>
            </div>
          </div>

          {/* Contact Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400 uppercase font-medium tracking-wide">24/7 Response Line</span>
              <a href="tel:5550000000" className="text-lg font-medium text-white hover:text-red-500 transition-colors">
                (555) 000-0000 (Demo)
              </a>
            </div>
            <button 
              onClick={onEmergencyClick}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium text-sm transition-all transform hover:scale-105 shadow-lg shadow-red-900/20 active:scale-95"
            >
              EMERGENCY HELP NOW
            </button>
          </div>

          {/* Mobile Phone Link */}
          <div className="md:hidden">
            <a href="tel:5550000000" className="flex items-center text-red-600 font-medium p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

