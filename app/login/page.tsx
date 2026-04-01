'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('demo@aegis.dev')
  const [password, setPassword] = useState('demo123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Demo mode — accept demo credentials instantly
    if (email === 'demo@aegis.dev' && password === 'demo123') {
      toast.success('Welcome to AEGIS!')
      setTimeout(() => router.push('/dashboard'), 500)
      return
    }

    toast.error('Invalid credentials. Use demo@aegis.dev / demo123')
    setLoading(false)
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
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: 420, padding: 40,
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 20, boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            style={{
              width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px var(--accent-glow)',
            }}
          >
            <Shield size={28} color="#fff" />
          </motion.div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Welcome to <span className="text-gradient">AEGIS</span></h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Sign in to your compliance dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
            <input
              type="email" placeholder="Email address" value={email}
              onChange={(e) => setEmail(e.target.value)} required style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
            <input
              type={showPassword ? 'text' : 'password'} placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} required style={{ ...inputStyle, paddingRight: 44 }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <motion.button
            type="submit" disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: '14px', background: loading ? 'var(--accent-light)' : 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, fontFamily: 'var(--font-display)',
              boxShadow: '0 0 20px var(--accent-glow)', transition: 'all 0.2s',
            }}
          >
            {loading ? 'Signing in...' : <>Sign In <ArrowRight size={16} /></>}
          </motion.button>
        </form>

        {/* Demo hint */}
        <div style={{
          marginTop: 20, padding: 14, borderRadius: 10,
          background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)',
          fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center',
        }}>
          <strong style={{ color: 'var(--accent-light)' }}>Demo Mode:</strong> Pre-filled with demo@aegis.dev / demo123
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: 'var(--accent-light)', textDecoration: 'none' }}>Create organization</Link>
        </p>
      </motion.div>
    </div>
  )
}
