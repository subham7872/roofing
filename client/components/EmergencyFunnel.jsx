'use client'

import { useState, useEffect } from 'react'
import { getServices } from '../services/api'
import { submitEmergencyRequest } from '../services/emergencyApi'

const EmergencyFunnel = ({ onClose }) => {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [zipCode, setZipCode] = useState('')
  const [description, setDescription] = useState('')
  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [email, setEmail] = useState('')
  const [safetyAdvice, setSafetyAdvice] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices()
        setServices(data)
      } catch (error) {
        console.error('Error fetching services:', error)
        setError('Failed to load services. Please try again.')
      }
    }
    fetchServices()
  }, [])

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setStep(2)
  }

  const handleNext = async () => {
    if (step === 2) {
      // Generate safety advice (optional, don't block if it fails)
      setIsLoading(true)
      try {
        // Safety advice will be generated on backend
        setStep(3)
      } catch (error) {
        console.error('Error generating safety advice:', error)
        // Continue anyway
        setStep(3)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedService || !zipCode || !fullName || !mobileNumber || !email) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const requestData = {
        serviceId: selectedService._id,
        zipCode,
        description: description || '',
        fullName,
        mobileNumber,
        email
      }

      const response = await submitEmergencyRequest(requestData)
      
      if (response.success) {
        setSafetyAdvice(response.data.safetyAdvice || '')
        setStep(4) // Success page
      } else {
        setError(response.message || 'Failed to submit request. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting emergency request:', error)
      setError(error.response?.data?.message || 'Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Funnel Content */}
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="bg-red-600 p-6 text-white flex justify-between items-center sticky top-0 z-10">
          <div>
            <h3 className="text-lg font-medium uppercase tracking-tight">Emergency Response Unit</h3>
            <p className="text-xs text-red-100">Step {step} of 4</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="space-y-6">
              <h4 className="text-xl font-medium text-slate-900">Select Emergency Service</h4>
              {services.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600">Loading services...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                  {services.map((service) => (
                    <button
                      key={service._id}
                      onClick={() => handleServiceSelect(service)}
                      className={`p-4 border-2 rounded-xl text-left transition-all ${
                        selectedService?._id === service._id 
                          ? 'border-red-600 bg-red-50 text-red-600' 
                          : 'border-slate-100 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-medium mb-1">{service.title}</div>
                      <div className="text-sm text-slate-500">{service.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: ZIP Code and Description */}
          {step === 2 && selectedService && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-medium text-slate-900 mb-2">Service: {selectedService.title}</h4>
                <p className="text-sm text-slate-600 mb-6">{selectedService.description}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Service ZIP Code *</label>
                <input 
                  type="text" 
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none"
                  placeholder="e.g. 90210"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none h-24 resize-none"
                  placeholder="e.g. Broken pipe in the kitchen, flooding living room..."
                ></textarea>
              </div>
              
              <button 
                onClick={handleNext}
                disabled={!zipCode || isLoading}
                className="w-full bg-red-600 text-white p-4 rounded-xl font-medium text-base hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'CONTINUE'}
              </button>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {safetyAdvice && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                  <h5 className="text-blue-800 font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Immediate Safety Advice
                  </h5>
                  <div className="text-sm text-blue-700 whitespace-pre-line leading-relaxed italic">
                    {safetyAdvice}
                  </div>
                </div>
              )}
              
              <h4 className="text-xl font-medium text-slate-900">Contact Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number *</label>
                <input 
                  type="tel" 
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                  placeholder="(555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                  placeholder="john.doe@example.com"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white p-5 rounded-xl font-medium text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'DISPATCH TEAM NOW'}
              </button>
              
              <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-medium">
                By clicking, you agree to 24/7 service dispatch terms. Confirmation email will be sent.
              </p>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-2xl font-medium text-slate-900">Request Submitted Successfully!</h4>
              <p className="text-slate-600 max-w-sm mx-auto">
                A confirmation email has been sent to <span className="text-red-600 font-medium">{email}</span>. 
                Our team will contact you within <span className="text-red-600 font-medium">5 minutes</span>.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-left">
                <p className="text-xs text-slate-500 font-medium uppercase mb-2">Service Details</p>
                <div className="space-y-1">
                  <p className="font-medium text-slate-900">{selectedService?.title}</p>
                  <p className="text-sm text-slate-600">ZIP Code: {zipCode}</p>
                  <p className="text-sm text-slate-600">Contact: {fullName}</p>
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
  )
}

export default EmergencyFunnel
