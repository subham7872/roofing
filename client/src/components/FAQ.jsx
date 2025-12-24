import React from 'react';
import { FAQS } from '../constants';

export const FAQ = () => (
  <section className="py-24 bg-white" id="faq">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-base font-medium text-blue-700 uppercase tracking-widest mb-4">FAQ</h2>
        <h3 className="text-4xl font-medium text-blue-900">Frequently Asked Questions</h3>
      </div>
      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <details key={idx} className="group border border-slate-100 rounded-xl overflow-hidden shadow-sm">
            <summary className="flex justify-between items-center p-6 text-lg font-medium text-blue-900 cursor-pointer hover:bg-slate-50 transition-colors list-none">
              {faq.question}
              <i className="fas fa-chevron-down text-blue-400 group-open:rotate-180 transition-transform"></i>
            </summary>
            <div className="p-6 pt-0 text-slate-600 leading-relaxed bg-slate-50/50">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

