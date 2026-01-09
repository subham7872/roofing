'use client'

import { useState, useRef, useEffect } from 'react'

// Generate unique session ID
const generateSessionId = () => {
  return 'chatbot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId] = useState(() => generateSessionId())
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Initialize conversation when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        role: 'assistant',
        content: "Can you tell me what problem you're facing?",
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
      setCurrentStep('issue')
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input.trim(), timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch('http://localhost:8088/api/chatbot/structured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          message: currentInput,
          currentStep
        })
      })

      const data = await response.json()

      if (data.success) {
        // Add assistant response
        if (data.message) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: data.message,
            timestamp: new Date()
          }])
        }

        // Update step
        setCurrentStep(data.nextStep)

        // If complete, auto-submit
        if (data.isComplete && data.leadData) {
          setTimeout(() => {
            handleSubmit()
          }, 1000)
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again or contact us directly.',
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error('Chatbot error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please try again or call us directly.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleSubmit = async () => {
    if (isLoading) return

    setIsLoading(true)
    setIsTyping(true)
    try {
      const response = await fetch('http://localhost:8088/api/chatbot/structured/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          businessId: null,
          serviceId: null
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message || 'Thank you! Your request has been submitted. Our team will contact you within 60 minutes.',
          timestamp: new Date()
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message || 'Sorry, there was an error submitting your request. Please try again or contact us directly.',
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error('Submit error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble submitting your request. Please try again or call us directly.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleOptionClick = (option) => {
    setInput(option)
    setTimeout(() => handleSend(), 100)
  }

  const getUrgencyOptions = () => {
    if (currentStep === 'urgency') {
      return ['Emergency', 'Today', 'Flexible']
    }
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <i className="fas fa-comments text-sm"></i>
              </div>
              <div>
                <h3 className="font-medium text-sm">RestorePro Assistant</h3>
                <span className="text-[10px] text-red-200">Online & Ready</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsOpen(false)
                setMessages([])
                setCurrentStep(null)
              }} 
              className="hover:bg-red-700 p-1 rounded transition"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-red-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Options for Urgency Step */}
          {getUrgencyOptions() && (
            <div className="px-4 pb-2 space-y-2">
              {getUrgencyOptions().map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-red-600 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition disabled:opacity-50 text-sm"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-slate-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isLoading || isTyping}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || isTyping || !input.trim()}
                className="bg-red-600 text-white w-10 h-10 rounded-lg flex items-center justify-center hover:bg-red-700 transition disabled:opacity-50"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        >
          <i className="fas fa-comment-dots text-2xl"></i>
        </button>
      )}
    </div>
  )
}
