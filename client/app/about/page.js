'use client'

import { motion } from 'framer-motion'

export default function AboutPage() {
  const sections = [
    {
      title: 'Our Story',
      content: 'Founded in 1998, RestorePro Services has been a trusted leader in emergency restoration for over 25 years. What started as a small local business has grown into a comprehensive restoration company serving communities across the region.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: 'Our Mission',
      content: 'To provide rapid, professional, and compassionate restoration services that help families and businesses recover from disasters quickly and completely. We believe that every property deserves expert care.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Our Values',
      content: 'Integrity, speed, and excellence guide everything we do. We operate with complete transparency, providing honest assessments and fair pricing. Our 60-minute response guarantee reflects our commitment.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: 'Our Promise',
      content: 'We guarantee 60-minute response times, direct insurance billing, and certified professional service. Your peace of mind is our priority, and we stand behind every restoration project with our full warranty.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ]

  const stats = [
    { number: '25+', label: 'Years of Experience' },
    { number: '10,000+', label: 'Properties Restored' },
    { number: '60', label: 'Minute Response Time' },
    { number: '4.9/5', label: 'Customer Rating' }
  ]

  return (
    <section className="py-24 bg-slate-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xs font-medium text-red-500 uppercase tracking-widest mb-3">About Us</h2>
          <h1 className="text-4xl md:text-5xl font-medium mb-6">
            About <span className="text-red-600">RestorePro</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
            Trusted emergency restoration experts serving communities for over 25 years. 
            We're here when disaster strikes, restoring your property and your peace of mind.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-3xl md:text-4xl font-medium text-red-600 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Sections */}
        <div className="relative">
          {/* Arrow Connectors - Desktop only */}
          {/* Row 1: Card 1 → Card 2 */}
          <div className="hidden lg:block absolute top-[20%] left-[calc(25%-2rem)] right-[calc(25%-2rem)] h-0.5 bg-slate-800 z-0">
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
              <svg className="w-6 h-6 text-slate-800" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {/* Row 2: Card 3 → Card 4 */}
          <div className="hidden lg:block absolute top-[70%] left-[calc(25%-2rem)] right-[calc(25%-2rem)] h-0.5 bg-slate-800 z-0">
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
              <svg className="w-6 h-6 text-slate-800" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {/* Vertical: Card 2 → Card 3 */}
          <div className="hidden lg:block absolute top-[20%] bottom-[30%] left-[75%] w-0.5 bg-slate-800 z-0">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <svg className="w-6 h-6 text-slate-800 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="bg-slate-800 rounded-2xl p-6 border border-slate-700"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ borderColor: '#ef4444', transition: { duration: 0.3 } }}
              >
                <div className="flex flex-col items-start space-y-4">
                  <div className="w-16 h-16 bg-red-600/10 rounded-xl flex items-center justify-center text-red-600">
                    {section.icon}
                  </div>
                <div className="flex-1">
                  <h2 className="text-xs font-medium text-red-500 uppercase tracking-widest mb-2">{section.title.toUpperCase()}</h2>
                  <h3 className="text-xl font-medium mb-3 text-white">
                    {section.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    {section.content}
                  </p>
                </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-3xl font-medium mb-4 text-white">
            Need Emergency Help?
          </h3>
          <p className="text-slate-200 mb-8 text-lg">
            Our team is available 24/7 to respond to your emergency
          </p>
          <a
            href="/contact"
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-medium text-base transition-all shadow-lg shadow-red-600/20"
          >
            <span>Contact Us Now</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
