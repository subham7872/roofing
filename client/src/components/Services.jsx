import React from 'react';
import { SERVICES } from '../constants';

export const Services = () => (
  <section className="py-24 bg-slate-50" id="services">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-base font-medium text-blue-700 uppercase tracking-widest mb-4">What We Do</h2>
        <h3 className="text-4xl font-medium text-blue-900 mb-6">Comprehensive Roofing Services</h3>
        <p className="text-lg text-slate-600">From residential homes to sprawling commercial properties, we have the expertise to handle any roofing project.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {SERVICES.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 mb-6 group-hover:bg-blue-700 group-hover:text-white transition-colors">
              <i className={`fas ${s.icon} text-2xl`}></i>
            </div>
            <h4 className="text-xl font-medium text-blue-900 mb-4">{s.title}</h4>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">{s.description}</p>
            <a href="#contact" className="text-blue-700 font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
              Request Quote <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

