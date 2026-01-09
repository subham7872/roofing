'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: 'Request Service',
    desc: 'Call us or fill out our simple online form.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: 'Quick Callback',
    desc: 'A local pro calls you within 15 minutes.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: 'On-Site Inspection',
    desc: 'Clear upfront quote provided on-site.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Job Done',
    desc: 'Quality work completed with a full warranty.'
  }
]

const HowItWorks = () => {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <motion.h2
            className="text-xs font-medium text-red-500 uppercase tracking-widest mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Process
          </motion.h2>
          <motion.h3
            className="text-3xl font-medium text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            How It Works
          </motion.h3>
          <motion.p
            className="text-slate-400 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stress-free repair process from start to finish.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connector Line - Desktop only */}
          <div className="hidden lg:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-800 z-0"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center group relative"
              >
                <div className="relative">
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-green-500 mb-6 border-4 border-slate-900 outline outline-2 outline-slate-800 group-hover:outline-green-500/50 transition-all">
                    <div className="bg-slate-700 p-4 rounded-full group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                  </div>
                  {/* Step Number Badge - Desktop only */}
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm hidden lg:flex">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-slate-300 text-base max-w-[200px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
