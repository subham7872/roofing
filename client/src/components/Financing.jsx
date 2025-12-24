import React from 'react';
import { Button } from './Button';

export const Financing = () => (
  <section className="py-24 bg-blue-900 text-white" id="financing">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-base font-medium text-blue-400 uppercase tracking-widest mb-4">Financing Options</h2>
          <h3 className="text-4xl font-medium mb-6">A New Roof That Fits Your Budget</h3>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            We've partnered with industry-leading lenders to offer flexible monthly payment plans. Protect your home now, pay comfortably over time.
          </p>
          <ul className="space-y-4 mb-10">
            {['$0 Down Payment Options', 'Low Monthly Payments', 'Quick Approval Process', 'No Early Prepayment Penalties'].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <i className="fas fa-check-circle text-blue-400"></i>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="text-lg">Apply for Financing</Button>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-2xl text-blue-900">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-calculator text-blue-700"></i>
            </div>
            <h4 className="text-2xl font-medium">Quick Estimator</h4>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Square Footage</label>
              <input type="range" min="1000" max="5000" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700" />
              <div className="flex justify-between mt-2 text-xs font-medium text-slate-500">
                <span>1,000 sq ft</span>
                <span>5,000+ sq ft</span>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-slate-500 text-sm mb-2">Starting as low as</p>
              <p className="text-4xl font-medium text-blue-700">$129<span className="text-lg font-medium text-slate-400">/mo</span></p>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              *Subject to credit approval. Estimates are for informational purposes and vary based on material choice and roof complexity.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

