import React from 'react';

export const Process = () => (
  <section className="py-24 bg-white" id="process">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-20">
        <h2 className="text-base font-medium text-blue-700 uppercase tracking-widest mb-4">The Plan</h2>
        <h3 className="text-3xl font-medium text-blue-900">How We Deliver Excellence</h3>
      </div>
      <div className="relative">
        {/* Connection Line */}
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-blue-100 -translate-y-1/2 z-0"></div>
        <div className="grid lg:grid-cols-5 gap-12 relative z-10">
          {[
            { step: '01', title: 'Connect', desc: 'Schedule your initial consultation via phone or web.', icon: 'fa-phone' },
            { step: '02', title: 'Evaluate', desc: 'We perform a thorough 21-point roof inspection.', icon: 'fa-search' },
            { step: '03', title: 'Formalize', desc: 'Receive a detailed, transparent proposal and scope.', icon: 'fa-file-signature' },
            { step: '04', title: 'Personalize', desc: 'Select materials, colors, and schedule your install.', icon: 'fa-palette' },
            { step: '05', title: 'Guarantee', desc: 'Job completed with a 100% satisfaction guarantee.', icon: 'fa-shield-check' },
          ].map((p, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-white border-4 border-blue-50 rounded-full flex items-center justify-center text-blue-700 text-lg font-medium mx-auto mb-6 group-hover:border-blue-700 transition-colors shadow-lg">
                <i className={`fas ${p.icon}`}></i>
              </div>
              <p className="text-blue-700 font-medium text-xs uppercase tracking-widest mb-2">Step {p.step}</p>
              <h4 className="text-lg font-medium text-blue-900 mb-4">{p.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed px-4">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

