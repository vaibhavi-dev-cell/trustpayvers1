'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, User, Mail, Lock, Building2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    toast.success('Organization created! Redirecting...')
    setTimeout(() => router.push('/dashboard'), 800)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px 12px 44px', background: 'var(--bg-surface)',
    border: '1px solid var(--border-default)', borderRadius: 10, color: 'var(--text-primary)',
    fontSize: 14, fontFamily: 'var(--font-display)', outline: 'none', transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', padding: 20,
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: 420, padding: 40,
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 20, boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px var(--accent-glow)',
          }}>
            <Shield size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Create <span className="text-gradient">Organization</span></h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Set up your compliance workspace</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ position: 'relative' }}>
            <Building2 size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
            <input placeholder="Organization name" required style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'} />
          </div>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
            <input placeholder="Your full name" required style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'} />
          </div>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
            <input type="email" placeholder="Email address" required style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'} />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
            <input type="password" placeholder="Password (min 8 characters)" required style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'} />
          </div>

          <motion.button type="submit" disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: '14px', background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'var(--font-display)', boxShadow: '0 0 20px var(--accent-glow)',
            }}
          >
            {loading ? 'Creating...' : <>Create Organization <ArrowRight size={16} /></>}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent-light)', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
