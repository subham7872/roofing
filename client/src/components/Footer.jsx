import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-xl font-medium text-white tracking-tight">
                <span className="text-red-600 mr-1">RESTORE</span>PRO
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">
                Restoring Homes. Rebuilding Peace.
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Serving the community with integrity and speed for over 25 years. We are your local partners in disaster recovery. (This is a demo website)
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors">f</a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors">in</a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors">ig</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Our Services</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-red-500 transition-colors">Water Damage Restoration</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Fire & Smoke Remediation</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Mold Cleanup & Removal</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Storm Damage Repair</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Sewage Extraction</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Resources</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-red-500 transition-colors">Insurance Claim FAQ</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Safety Tips Guide</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Commercial Restoration</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Residential Services</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-slate-400 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Demo Street,<br />Demo City, ST 12345 (Demo Address)</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-white font-medium">(555) 000-0000 (Demo Number)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} RestorePro Services. All Rights Reserved. Licensed & Insured #DEMO123456. (This is a demo website)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

