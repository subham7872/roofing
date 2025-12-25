import React, { useState } from 'react';
import { DamageType } from '../types';
import { getSafeSteps } from '../services/geminiService';

const EmergencyFunnel = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [damageType, setDamageType] = useState(null);
  const [zip, setZip] = useState('');
  const [details, setDetails] = useState('');
  const [contact, setContact] = useState({ name: '', phone: '' });
  const [safetyAdvice, setSafetyAdvice] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = async () => {
    if (step === 2 && damageType) {
      setIsGenerating(true);
      const advice = await getSafeSteps(damageType, details || 'Emergency restoration request');
      setSafetyAdvice(advice);
      setIsGenerating(false);
      setStep(3);
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(4); // Thank you page
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Funnel Content */}
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-red-600 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium uppercase tracking-tight">Emergency Response Unit</h3>
            <p className="text-xs text-red-100">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h4 className="text-xl font-medium text-slate-900">What is the emergency?</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.values(DamageType).map((type) => (
                  <button
                    key={type}
                    onClick={() => { setDamageType(type); setStep(2); }}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${
                      damageType === type ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="font-medium">{type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h4 className="text-xl font-medium text-slate-900">Location & Details</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Service ZIP Code</label>
                <input 
                  type="text" 
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none"
                  placeholder="e.g. 90210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quick Description (Optional)</label>
                <textarea 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none h-24 resize-none"
                  placeholder="e.g. Broken pipe in the kitchen, flooding living room..."
                ></textarea>
              </div>
              <button 
                onClick={handleNext}
                disabled={!zip || isGenerating}
                className="w-full bg-red-600 text-white p-4 rounded-xl font-medium text-base hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {isGenerating ? (
                   <span className="flex items-center">
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Processing...
                   </span>
                ) : 'GET IMMEDIATE QUOTE & SAFETY STEPS'}
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <h5 className="text-blue-800 font-medium mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Immediate Safety Advice
                </h5>
                <div className="text-sm text-blue-700 whitespace-pre-line leading-relaxed italic">
                  {safetyAdvice || "Wait for further instructions..."}
                </div>
              </div>
              
              <h4 className="text-xl font-medium text-slate-900">Who should we call?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={contact.name}
                    onChange={(e) => setContact({...contact, name: e.target.value})}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={contact.phone}
                    onChange={(e) => setContact({...contact, phone: e.target.value})}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                    placeholder="(555) 000-0000"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-red-600 text-white p-5 rounded-xl font-medium text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95"
              >
                DISPATCH TEAM NOW
              </button>
              <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-medium">
                By clicking, you agree to 24/7 service dispatch terms
              </p>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-2xl font-medium text-slate-900">Team Dispatched!</h4>
              <p className="text-slate-600 max-w-sm mx-auto">
                A project manager has been assigned to your case and will call you within <span className="text-red-600 font-medium">5 minutes</span>.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-left">
                <p className="text-xs text-slate-500 font-medium uppercase mb-2">Assigned Tech</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                    <img src="https://picsum.photos/seed/tech/100" alt="Tech" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Marcus R.</p>
                    <p className="text-xs text-slate-500">Master Restorer #882</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-slate-500 font-medium hover:text-slate-800 transition-colors"
              >
                Back to Site
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyFunnel;

