import React from 'react';
import { Button } from './Button';
import { TRUST_BADGES } from '../constants';

export const Hero = () => (
  <header className="relative py-24 md:py-36 bg-blue-900 overflow-hidden" id="home">
    <div className="absolute inset-0 opacity-20">
      <img src="https://picsum.photos/seed/roofbg/1920/1080" alt="Roofing Background" className="w-full h-full object-cover" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/80 to-transparent"></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-700 text-blue-50 text-xs font-medium uppercase tracking-widest mb-6">
          Demo Location's Premier Roofer
        </span>
        <h1 className="text-4xl md:text-6xl font-medium text-white mb-6 leading-tight">
          Reliable Roofing Solutions for Your Home
        </h1>
        <p className="text-xl text-blue-100 mb-10 leading-relaxed">
          Experience disciplined excellence with trusted roofing experts. From minor repairs to full replacements, we deliver results you can depend on.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="secondary" className="text-lg py-4 px-8">Request Free Estimate</Button>
          <Button variant="outline" className="text-lg py-4 px-8 border-white text-white hover:bg-white/10">View Our Services</Button>
        </div>
        <div className="mt-12 flex flex-wrap gap-6 items-center">
          {TRUST_BADGES.slice(0, 3).map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2 text-blue-200">
              <i className={`fas ${badge.icon} text-lg`}></i>
              <span className="text-sm font-semibold">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </header>
);

