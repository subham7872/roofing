import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { Button } from './Button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-700 rounded flex items-center justify-center shadow-lg">
                <i className="fas fa-shield-halved text-white text-xl"></i>
              </div>
              <span className="font-medium text-xl tracking-tight text-blue-900 leading-tight">
                Demo Roofing<br /><span className="text-blue-600">Company Name</span>
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {NAV_ITEMS.map((item) => (
              <a 
                key={item.href} 
                href={item.href} 
                className="text-slate-600 hover:text-blue-700 font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Button variant="primary">Get a Quote</Button>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-blue-700 p-2">
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-xl">
          {NAV_ITEMS.map((item) => (
            <a 
              key={item.href} 
              href={item.href} 
              className="block text-lg font-medium text-slate-700 hover:text-blue-700"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Button variant="primary" className="w-full">Get a Quote Now</Button>
        </div>
      )}
    </nav>
  );
};

