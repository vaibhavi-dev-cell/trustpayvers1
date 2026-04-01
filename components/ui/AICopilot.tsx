'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Sparkles, Loader2, Bot } from 'lucide-react'

const SUGGESTIONS = [
  "Explain my biggest SOC 2 gap",
  "Generate a Vendor Risk policy",
  "Summarize new EU AI Act impacts"
]

export default function AICopilot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{role:'user'|'ai', content:string}[]>([
    { role: 'ai', content: 'Hello! I am your AEGIS Co-pilot. I can analyze your infrastructure gaps, generate policies, and monitor regulations. How can I help today?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (text: string) => {
    if (!text.trim()) return
    const userMsg = text.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setIsTyping(true)

    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800))
    
    // Determine response based on keywords
    let responseText = "I'm analyzing that request against your current framework data..."
    const lower = userMsg.toLowerCase()
    
    if (lower.includes('soc 2') || lower.includes('gap')) {
      responseText = "**SOC 2 Gap Context:** You currently have 38 open control gaps. The most critical is missing MFA (Multi-Factor Authentication) on your core AWS IAM root account. I recommend addressing that immediately to fulfill SOC 2 CC6.1.\\n\\nWould you like me to draft an IAM policy enforcement script?"
    } else if (lower.includes('policy') || lower.includes('vendor')) {
      responseText = "I can help with that. By referencing ISO 27001 Annex A.15, I would recommend including sections on:\\n1. Due Diligence Questionnaire\\n2. Service Level Agreement monitoring\\n3. Annual security review procedures\\n\\nShould I generate the full text into your Policy Library?"
    } else if (lower.includes('eu ai') || lower.includes('impact')) {
      responseText = "**Regulatory Alert:** The EU AI Act entered into force recently. Given your context, if you deploy high-risk AI systems (like biometrics or critical infrastructure), you must implement a formal risk management system (Article 9) and ensure human oversight (Article 14).\\n\\nAEGIS has automatically flagged this under your 'Action Required' queue."
    } else {
      responseText = "Based on your AWS environment and active frameworks (SOC 2, GDPR), that looks completely normal. I'll continue to monitor your CloudTrail logs for any anomalous IAM escalations."
    }

    // Stream the response out
    setMessages(prev => [...prev, { role: 'ai', content: '' }])
    
    let currentText = ''
    for (let i = 0; i < responseText.length; i+=3) {
      await new Promise(r => setTimeout(r, 15))
      currentText += responseText.substr(i, 3)
      setMessages(prev => {
        const newMsgs = [...prev]
        newMsgs[newMsgs.length - 1].content = currentText
        return newMsgs
      })
    }
    
    setIsTyping(false)
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            style={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999
            }}
          >
            <Sparkles size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              width: 380,
              height: 600,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-strong)',
              borderRadius: 20,
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1000,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(90deg, rgba(99,102,241,0.1) 0%, transparent 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Bot size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>AEGIS Co-pilot</div>
                  <div style={{ fontSize: 12, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} /> Online (AWS Bedrock)
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  flexDirection: m.role === 'user' ? 'row-reverse' : 'row'
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: m.role === 'ai' ? 'rgba(99,102,241,0.2)' : 'var(--bg-overlay)',
                    border: '1px solid ' + (m.role === 'ai' ? 'rgba(99,102,241,0.5)' : 'var(--border-default)'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: m.role === 'ai' ? '#6366f1' : 'var(--text-secondary)'
                  }}>
                    {m.role === 'ai' ? <Sparkles size={14} /> : <div style={{ fontSize: 12, fontWeight: 700 }}>U</div>}
                  </div>
                  <div style={{
                    background: m.role === 'user' ? '#6366f1' : 'var(--bg-surface)',
                    color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                    padding: '12px 16px',
                    borderRadius: 16,
                    borderTopLeftRadius: m.role === 'ai' ? 4 : 16,
                    borderTopRightRadius: m.role === 'user' ? 4 : 16,
                    fontSize: 14,
                    lineHeight: 1.6,
                    border: m.role === 'user' ? 'none' : '1px solid var(--border-subtle)',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                    <Loader2 size={14} className="animate-spin" />
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', gap: 4 }}>
                    <span className="animate-bounce inline-block">.</span>
                    <span className="animate-bounce inline-block" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="animate-bounce inline-block" style={{ animationDelay: '0.4s' }}>.</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: 16, borderTop: '1px solid var(--border-default)', background: 'var(--bg-card)' }}>
              
              {messages.length === 1 && (
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
                  {SUGGESTIONS.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSend(s)}
                      style={{
                        padding: '6px 12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
                        borderRadius: 20, color: '#818cf8', fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <form 
                onSubmit={e => { e.preventDefault(); handleSend(input); }}
                style={{ display: 'flex', gap: 8 }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask AEGIS anything..."
                  style={{
                    flex: 1, padding: '12px 16px', background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)', borderRadius: 12,
                    color: '#fff', outline: 'none', fontSize: 14
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  style={{
                    width: 44, height: 44, borderRadius: 12, background: input.trim() ? '#6366f1' : 'var(--bg-surface)',
                    border: 'none', color: '#fff', cursor: input.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
