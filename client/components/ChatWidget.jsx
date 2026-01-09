'use client'

import { useState, useRef, useEffect } from 'react'

// Generate unique session ID
const generateSessionId = () => {
  return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId] = useState(() => generateSessionId())
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm RestorePro Services assistant. I'm here to help you with emergency restoration services. What's your name?", timestamp: new Date() }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [leadData, setLeadData] = useState({})
  const [isComplete, setIsComplete] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    // Check if user wants to submit
    if (isComplete && (currentInput.toLowerCase().includes('yes') || currentInput.toLowerCase().includes('submit') || currentInput.toLowerCase().includes('confirm'))) {
      handleSubmit()
      return
    }

    try {
      const response = await fetch('http://localhost:8088/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          message: currentInput
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message, timestamp: new Date() }])
        setLeadData(data.leadData || {})
        setIsComplete(data.isComplete || false)

        // If complete, show submit option
        if (data.isComplete && !isComplete) {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: 'Would you like me to submit your request? Our team will contact you within 60 minutes. Type "yes" to submit.',
              timestamp: new Date()
            }])
          }, 500)
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
    }
  }

  const handleSubmit = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8088/api/chatbot/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          businessId: null, // Will use first active business
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
        setIsComplete(false)
        setLeadData({})
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
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] flex flex-col glass-morphism rounded-2xl shadow-2xl border border-red-100 overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <i className="fas fa-robot text-sm"></i>
              </div>
              <div>
                <h3 className="font-medium text-sm">RestorePro Assistant</h3>
                <span className="text-[10px] text-red-200">Online & Ready</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-red-700 p-1 rounded transition">
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-red-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-slate-800 rounded-tl-none shadow-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm text-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-3 border-t bg-white space-y-2">
            {isComplete && (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 text-sm mb-2"
              >
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isComplete && handleSend()}
                placeholder={isComplete ? "Type 'yes' to submit or ask a question..." : "Type your message..."}
                className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || isComplete}
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

