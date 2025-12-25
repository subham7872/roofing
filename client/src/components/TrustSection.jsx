import React from 'react';

const TrustSection = () => {
  return (
    <div className="bg-slate-100 py-12 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all">
          <div className="flex flex-col items-center">
             <div className="bg-white p-3 rounded-full shadow-sm mb-2 border border-slate-200">
               <span className="text-xl font-medium text-slate-900 italic">IICRC</span>
             </div>
             <span className="text-[10px] font-medium text-slate-500 uppercase">Certified Firm</span>
          </div>
          <div className="flex flex-col items-center">
             <div className="bg-white p-3 rounded-full shadow-sm mb-2 border border-slate-200">
               <span className="text-xl font-medium text-slate-900">EPA</span>
             </div>
             <span className="text-[10px] font-medium text-slate-500 uppercase">Lead-Safe Firm</span>
          </div>
          <div className="flex flex-col items-center">
             <div className="bg-white p-3 rounded-full shadow-sm mb-2 border border-slate-200">
               <span className="text-xl font-medium text-slate-900">BBB</span>
             </div>
             <span className="text-[10px] font-medium text-slate-500 uppercase">A+ Accredited</span>
          </div>
          <div className="flex flex-col items-center">
             <div className="bg-white p-3 rounded-full shadow-sm mb-2 border border-slate-200">
               <span className="text-xl font-medium text-slate-900">RIA</span>
             </div>
             <span className="text-[10px] font-medium text-slate-500 uppercase">Member Since '02</span>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex space-x-4">
            <div className="bg-red-600 text-white p-4 rounded-xl h-fit">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 text-base mb-1">Fast Response Time</h4>
              <p className="text-slate-600 text-sm">Teams are ready to be dispatched 24/7/365. We aim for under 60 minutes for local calls.</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="bg-blue-600 text-white p-4 rounded-xl h-fit">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 text-base mb-1">Insurance Direct Billing</h4>
              <p className="text-slate-600 text-sm">We handle all the paperwork. From claim filing to final walkthrough, we work for you.</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="bg-green-600 text-white p-4 rounded-xl h-fit">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.704a1 1 0 00.94-.659l1.192-3.377a1 1 0 00-1.28-1.28l-3.377 1.192a1 1 0 00-.659.94V10z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.296a1 1 0 00-.94.659l-1.192 3.377a1 1 0 001.28 1.28l3.377-1.192a1 1 0 00.659-.94V14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 10l5.5-5.5M10 14l-5.5 5.5" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 text-base mb-1">Modern Equipment</h4>
              <p className="text-slate-600 text-sm">Thermal imaging, LGR dehumidifiers, and HEPA filtration ensure the job is done right.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSection;

