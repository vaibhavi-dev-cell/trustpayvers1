'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, Zap, Globe, Lock, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient background */}
      <div style={{
        position: 'absolute', top: '-50%', left: '-20%', width: '140%', height: '200%',
        background: 'radial-gradient(ellipse at 30% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', position: 'relative', zIndex: 10,
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={28} color="#6366f1" />
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }} className="text-gradient">AEGIS</span>
        </div>
        <Link href="/login" style={{
          padding: '10px 24px', background: 'var(--accent)', color: '#fff', borderRadius: 8,
          textDecoration: 'none', fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
          border: 'none', cursor: 'pointer',
        }}>
          Launch Dashboard →
        </Link>
      </nav>

      {/* Hero */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px',
              background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 20, fontSize: 13, color: 'var(--accent-light)', marginBottom: 24, fontWeight: 500,
            }}
          >
            <Zap size={14} /> Powered by AWS Bedrock + Blockchain
          </motion.div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.1,
            marginBottom: 24, letterSpacing: '-2px',
          }}>
            Zero to <span className="text-gradient">Audit-Ready</span><br />in 10 Minutes
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-secondary)',
            maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.6,
          }}>
            AEGIS is the first AI compliance co-pilot that turns your AWS infrastructure
            into audit-ready evidence automatically — then watches regulatory changes globally
            so you never miss a compliance deadline.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', background: 'var(--accent)', color: '#fff',
              borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 16,
              boxShadow: '0 0 30px var(--accent-glow)',
            }}>
              Get Started <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', background: 'var(--glass)',
              border: '1px solid var(--border-default)', color: 'var(--text-primary)',
              borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 16,
            }}>
              View Demo
            </Link>
          </div>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {[
            { icon: <Shield size={24} />, title: 'AI Policy Generation', desc: 'Claude 3.5 Sonnet generates complete, tailored compliance policies in seconds with real-time streaming.' },
            { icon: <BarChart3 size={24} />, title: 'Infrastructure Scanning', desc: 'Scan AWS Config, CloudTrail, and Security Hub — map findings to compliance controls automatically.' },
            { icon: <Globe size={24} />, title: 'Regulatory Intelligence', desc: 'Agentic AI monitors global regulatory feeds and generates impact analysis with prioritized action plans.' },
            { icon: <Lock size={24} />, title: 'Blockchain Evidence', desc: 'SHA-256 hash every piece of evidence and anchor to Polygon blockchain — tamper-proof, auditor-verifiable.' },
            { icon: <Zap size={24} />, title: 'Gap Analysis', desc: 'Visual heatmaps show control gaps instantly. AI suggests specific AWS services and steps to remediate.' },
            { icon: <ArrowRight size={24} />, title: 'Audit Reports', desc: 'One-click PDF generation with executive summaries, evidence appendix, and blockchain verification links.' },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                padding: 28, borderRadius: 16,
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                cursor: 'default', transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'rgba(99, 102, 241, 0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#6366f1', marginBottom: 16,
              }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{feat.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ textAlign: 'center', marginTop: 80, paddingBottom: 40 }}
        >
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            SOC 2 · ISO 27001 · GDPR · PCI DSS · HIPAA · RBI DPDP — All frameworks supported
          </p>
        </motion.div>
      </main>
    </div>
  )
}
