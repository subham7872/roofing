import React from 'react';
import { Button } from './Button';

export const About = () => (
  <section className="py-24 bg-white" id="about">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full z-0"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-50 rounded-full z-0"></div>
          <img 
            src="https://picsum.photos/seed/contractor/800/1000" 
            alt="Our Team at Work" 
            className="rounded-2xl shadow-2xl relative z-10 w-full"
          />
          <div className="absolute bottom-10 left-10 bg-blue-700 text-white p-6 rounded-xl shadow-xl z-20">
            <p className="text-4xl font-medium mb-1">15+</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Years of Excellence</p>
          </div>
        </div>
        <div>
          <h2 className="text-base font-medium text-blue-700 uppercase tracking-widest mb-4">Our Values</h2>
          <h3 className="text-4xl font-medium text-blue-900 mb-6 leading-tight">Built on Transparency, Accountability, and Discipline</h3>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            At "Demo Roofing Company," we believe a roof is more than just shingles; it's your family's protection. Our team operates with a commitment to disciplined excellence, ensuring every nail is driven correctly and every client is treated with respect. (This is a demo website)
          </p>
          <div className="space-y-6 mb-10">
            {[
              { title: 'Transparency', desc: 'No hidden fees or surprise costs. Just honest assessments.', icon: 'fa-eye' },
              { title: 'Accountability', desc: 'We take full ownership of our work from start to finish.', icon: 'fa-handshake' },
              { title: 'Results', desc: 'Durable, beautiful roofs that withstand tough weather conditions.', icon: 'fa-check-double' }
            ].map((v, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
                  <i className={`fas ${v.icon} text-xl`}></i>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">{v.title}</h4>
                  <p className="text-slate-600 text-sm">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="primary">Learn More About Us</Button>
        </div>
      </div>
    </div>
  </section>
);

