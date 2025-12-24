import React from 'react';
import { TESTIMONIALS } from '../constants';

export const Testimonials = () => (
  <section className="py-24 bg-slate-50" id="reviews">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-base font-medium text-blue-700 uppercase tracking-widest mb-4">Customer Love</h2>
        <h3 className="text-4xl font-medium text-blue-900">What Our Clients Say</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex text-yellow-400 mb-6">
              {[...Array(t.rating)].map((_, i) => <i key={i} className="fas fa-star text-sm"></i>)}
            </div>
            <p className="text-slate-700 italic mb-8 leading-relaxed">"{t.text}"</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-medium text-blue-700">
                {t.name.charAt(0)}
              </div>
              <div>
                <h5 className="font-medium text-blue-900 text-sm">{t.name}</h5>
                <p className="text-slate-500 text-xs">{t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

