import React from 'react';

export const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center">
              <i className="fas fa-shield-halved text-white text-sm"></i>
            </div>
            <span className="font-medium text-lg tracking-tight text-white">
              Demo Roofing Company
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Delivering high-quality roofing solutions. This is a demo website for client presentation purposes.
          </p>
          <div className="flex gap-4">
            {['facebook', 'instagram', 'twitter', 'linkedin'].map((s) => (
              <a key={s} href="#" className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all">
                <i className={`fab fa-${s}`}></i>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-white font-medium mb-6">Services</h5>
          <ul className="space-y-4 text-sm">
            {['Residential Roofing', 'Commercial Roofing', 'Roof Replacement', 'Leak Repairs', 'Inspections'].map((l) => (
              <li key={l}><a href="#" className="hover:text-blue-400 transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-white font-medium mb-6">Company</h5>
          <ul className="space-y-4 text-sm">
            {['About Us', 'Our Process', 'Financing', 'Careers', 'Privacy Policy'].map((l) => (
              <li key={l}><a href="#" className="hover:text-blue-400 transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-white font-medium mb-6">Contact</h5>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3"><i className="fas fa-location-dot mt-1 text-blue-700"></i> 123 Demo Street,<br />Demo City, ST 12345 (Demo Address)</li>
            <li className="flex gap-3"><i className="fas fa-phone mt-1 text-blue-700"></i> (555) 000-0000 (Demo Number)</li>
            <li className="flex gap-3"><i className="fas fa-envelope mt-1 text-blue-700"></i> demo@example.com (Demo Email)</li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-800 text-center text-xs">
        <p>© {new Date().getFullYear()} Demo Roofing Company. Licensed #DEMO123456. All Rights Reserved. (This is a demo website)</p>
      </div>
    </div>
  </footer>
);

