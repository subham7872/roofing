import React from 'react';
import { Button } from './Button';
import { TRUST_BADGES } from '../constants';

export const Contact = () => (
  <section className="py-24 bg-blue-50" id="contact">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
        <div className="p-8 md:p-16 bg-blue-700 text-white">
          <h3 className="text-3xl font-medium mb-8">Get Your Free Estimate Today</h3>
          <p className="text-blue-100 mb-12 text-lg">Our experts are standing by to provide you with a professional evaluation of your roofing needs.</p>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <i className="fas fa-location-dot mt-1 text-blue-300"></i>
              <div>
                <h4 className="font-medium mb-1">Our Service Area</h4>
                <p className="text-blue-100 text-sm">Demo City, Demo County, and surrounding areas. (This is a demo website)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <i className="fas fa-phone-volume mt-1 text-blue-300"></i>
              <div>
                <h4 className="font-medium mb-1">Call Us Directly</h4>
                <p className="text-blue-100 text-sm">(555) 000-0000 (Demo Number)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <i className="fas fa-envelope mt-1 text-blue-300"></i>
              <div>
                <h4 className="font-medium mb-1">Email Us</h4>
                <p className="text-blue-100 text-sm">demo@example.com (Demo Email)</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-16 border-t border-blue-600">
            <h4 className="font-medium mb-4 uppercase tracking-widest text-xs opacity-60">Verified Credentials</h4>
            <div className="flex flex-wrap gap-4">
               {TRUST_BADGES.map((b, i) => (
                 <div key={i} className="flex items-center gap-2 bg-blue-800/50 px-3 py-2 rounded-lg text-xs font-semibold">
                    <i className={`fas ${b.icon}`}></i> {b.name}
                 </div>
               ))}
            </div>
          </div>
        </div>
        
        <div className="p-8 md:p-16">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Service Needed</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option>Select a Service</option>
                <option>Residential Replacement</option>
                <option>Commercial Installation</option>
                <option>Roof Repair</option>
                <option>Inspection / Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tell us about your project</label>
              <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type your message here..."></textarea>
            </div>
            <Button type="submit" className="w-full py-4 text-lg">Request Free Estimate</Button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

