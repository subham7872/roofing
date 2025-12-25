import React, { useState } from 'react';

const SAMPLES = [
  {
    title: "Living Room Flood",
    before: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=1200",
    after: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
    service: "Water Damage"
  },
  {
    title: "Kitchen Fire Damage",
    before: "https://images.unsplash.com/photo-1518173946687-a4c8a9833d8e?auto=format&fit=crop&q=80&w=1200",
    after: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200",
    service: "Fire Restoration"
  }
];

const BeforeAfter = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xs font-medium text-red-500 uppercase tracking-widest mb-3">The Results</h2>
            <p className="text-3xl font-medium mb-2">Seeing is Believing</p>
            <p className="text-slate-400">Real projects restored to original (or better) condition.</p>
          </div>
          <div className="flex space-x-2">
            {SAMPLES.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveIdx(i)}
                className={`w-12 h-1.5 rounded-full transition-all ${activeIdx === i ? 'bg-red-600 w-24' : 'bg-slate-700'}`}
              ></button>
            ))}
          </div>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-800 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <div className="relative group overflow-hidden h-[400px]">
            <img src={SAMPLES[activeIdx].before} alt="Before" className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 bg-red-600/90 backdrop-blur-sm text-white px-4 py-1 rounded-lg font-medium text-sm">BEFORE</div>
          </div>
          <div className="relative group overflow-hidden h-[400px]">
            <img src={SAMPLES[activeIdx].after} alt="After" className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 bg-green-600/90 backdrop-blur-sm text-white px-4 py-1 rounded-lg font-medium text-sm">AFTER</div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="bg-slate-800/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-700/50 inline-flex items-center space-x-4">
             <span className="text-red-500 font-medium uppercase text-xs tracking-widest">Featured Case:</span>
             <span className="font-medium text-base">{SAMPLES[activeIdx].title}</span>
             <span className="h-4 w-px bg-slate-700"></span>
             <span className="text-slate-400 text-sm">{SAMPLES[activeIdx].service}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;

