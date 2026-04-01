'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanSearch, CheckCircle2, Loader2, AlertTriangle, Shield, Database, Cloud, Lock, Activity, Server, Key, ChevronRight } from 'lucide-react'
import { getDemoData } from '@/lib/demo-data'
import type { InfrastructureScan, ScanFinding } from '@/types'

const severityColors: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#84cc16', INFO: '#3b82f6'
}
const serviceIcons: Record<string, React.ReactNode> = {
  IAM: <Lock size={18}/>, S3: <Database size={18}/>, EC2: <Server size={18}/>,
  RDS: <Database size={18}/>, CloudTrail: <Activity size={18}/>, Config: <Shield size={18}/>,
  SecurityHub: <Shield size={18}/>, KMS: <Key size={18}/>, default: <Cloud size={18}/>
}

const scanServices = [
  { key: 'iam', label: 'IAM Users & Policies', icon: <Lock size={16}/> },
  { key: 's3', label: 'S3 Buckets & Policies', icon: <Database size={16}/> },
  { key: 'ec2', label: 'EC2 Security Groups', icon: <Server size={16}/> },
  { key: 'rds', label: 'RDS Encryption', icon: <Database size={16}/> },
  { key: 'cloudtrail', label: 'CloudTrail Logging', icon: <Activity size={16}/> },
  { key: 'config', label: 'Config Rules', icon: <Shield size={16}/> },
  { key: 'securityhub', label: 'Security Hub Findings', icon: <Shield size={16}/> },
  { key: 'kms', label: 'KMS Key Rotation', icon: <Key size={16}/> },
]

const progressLogs = [
  'Authenticating with AWS... ✓',
  'Scanning IAM users and policies... found 2 issues',
  'Scanning S3 bucket configurations... found 2 issues',
  'Scanning EC2 security groups... found 1 issue',
  'Scanning RDS encryption settings... found 1 issue',
  'Checking CloudTrail configuration... found 1 issue',
  'Scanning Config rules compliance... found 1 issue',
  'Fetching Security Hub findings... found 1 issue',
  'Checking KMS key rotation... found 1 issue',
  'Generating AI-powered summary...',
  'Scan complete. 12 findings across 8 services.',
]

export default function ScanPage() {
  const [step, setStep] = useState<'connect'|'scope'|'running'|'results'>('connect')
  const [selected, setSelected] = useState<string[]>(scanServices.map(s => s.key))
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const scans = getDemoData('scans') as InfrastructureScan[]
  const latestScan = scans[0]!

  const startScan = async () => {
    setStep('running')
    setProgress(0)
    setLogs([])
    for (let i = 0; i < progressLogs.length; i++) {
      await new Promise(r => setTimeout(r, 500))
      setLogs(prev => [...prev, progressLogs[i]!])
      setProgress(Math.round(((i + 1) / progressLogs.length) * 100))
    }
    setTimeout(() => setStep('results'), 500)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', background: 'var(--bg-surface)',
    border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)',
    fontSize: 14, fontFamily: 'var(--font-display)', outline: 'none',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4 }}>
          Infrastructure <span className="text-gradient">Scan</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Scan your AWS infrastructure for compliance gaps and security findings</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {['Connect AWS', 'Select Scope', 'Scanning', 'Results'].map((s, i) => {
          const stepMap = ['connect','scope','running','results']
          const current = stepMap.indexOf(step)
          const done = i < current
          const active = i === current
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  background: done ? '#22c55e' : active ? '#6366f1' : 'var(--bg-card)',
                  color: done || active ? '#fff' : 'var(--text-muted)',
                  border: `2px solid ${done ? '#22c55e' : active ? '#6366f1' : 'var(--border-default)'}`,
                }}>
                  {done ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</span>
              </div>
              {i < 3 && <ChevronRight size={14} color="var(--text-muted)" />}
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Connect */}
        {step === 'connect' && (
          <motion.div key="connect" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }}
            style={{ maxWidth: 560, padding: 32, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                <Cloud size={22}/>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 17 }}>Connect AWS Account</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Demo mode: pre-filled with mock credentials</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>AWS Access Key ID</label>
                <input defaultValue="AKIADEMO1234567890" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>AWS Secret Access Key</label>
                <input type="password" defaultValue="demo-secret-key-never-use-in-production" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>AWS Region</label>
                <input defaultValue="us-east-1" style={inputStyle} />
              </div>
              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', fontSize: 13, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16}/> Demo mode: AWS connection pre-verified
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setStep('scope')}
                style={{ padding: '13px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                Continue → Select Scan Scope
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Scope */}
        {step === 'scope' && (
          <motion.div key="scope" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }}
            style={{ maxWidth: 600, padding: 32, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 4 }}>Select Scan Scope</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Choose which AWS services to audit for compliance</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button onClick={() => setSelected(selected.length === scanServices.length ? [] : scanServices.map(s=>s.key))}
                style={{ fontSize: 13, color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                {selected.length === scanServices.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {scanServices.map(svc => {
                const on = selected.includes(svc.key)
                return (
                  <motion.div key={svc.key} whileHover={{ scale: 1.02 }}
                    onClick={() => setSelected(on ? selected.filter(s=>s!==svc.key) : [...selected,svc.key])}
                    style={{
                      padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
                      background: on ? 'rgba(99,102,241,0.08)' : 'var(--bg-surface)',
                      border: `1px solid ${on ? 'rgba(99,102,241,0.3)' : 'var(--border-subtle)'}`,
                      display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s',
                    }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${on ? '#6366f1' : 'var(--border-default)'}`, background: on ? '#6366f1' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {on && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
                    </div>
                    <span style={{ color: on ? '#818cf8' : 'var(--text-muted)' }}>{svc.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: on ? 600 : 400 }}>{svc.label}</span>
                  </motion.div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep('connect')} style={{ flex: 1, padding: '13px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 10, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 14 }}>← Back</button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startScan}
                style={{ flex: 2, padding: '13px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <ScanSearch size={16}/> Start Scan ({selected.length} services)
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Running */}
        {step === 'running' && (
          <motion.div key="running" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ padding: 40, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', margin: '0 auto 24px' }} />
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Scanning AWS Infrastructure...</div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{progress}% complete</div>
            <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-surface)', overflow: 'hidden', maxWidth: 500, margin: '0 auto 24px' }}>
              <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }}
                style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
            </div>
            <div style={{ maxWidth: 500, margin: '0 auto', padding: 16, background: 'var(--bg-surface)', borderRadius: 10, fontFamily: 'var(--font-mono)', fontSize: 12, textAlign: 'left', maxHeight: 200, overflow: 'auto' }}>
              {logs.map((log, i) => (
                <div key={i} style={{ color: log.includes('error') || log.includes('issue') ? '#f59e0b' : '#22c55e', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>$ </span>{log}
                </div>
              ))}
              {progress < 100 && <span className="glow" style={{ color: '#6366f1' }}>▌</span>}
            </div>
          </motion.div>
        )}

        {/* STEP 4: Results */}
        {step === 'results' && (
          <motion.div key="results" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Summary */}
            <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <CheckCircle2 size={32} color="#22c55e"/>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>Scan Complete — {latestScan.findingsCount} findings across 8 services</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>{latestScan.criticalCount} critical · 4 high · 5 medium · 2 low</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
                  <button style={{ padding: '10px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-display)' }}>Generate Evidence</button>
                  <button style={{ padding: '10px 16px', background: '#6366f1', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)' }}>Generate Report</button>
                </div>
              </div>
              <div style={{ padding: 16, borderRadius: 10, background: 'var(--bg-surface)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text-primary)' }}>AI Summary: </strong>{latestScan.summary}
              </div>
            </div>

            {/* Findings */}
            <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Findings</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {latestScan.rawFindings.map((f: ScanFinding, i: number) => (
                  <motion.div key={i} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay: i*0.05 }}
                    style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--bg-surface)', border: `1px solid ${severityColors[f.severity]}22`, display: 'grid', gridTemplateColumns: '100px 140px 1fr auto', gap: 16, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--text-muted)' }}>{serviceIcons[f.service] ?? serviceIcons['default']}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{f.service}</span>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: severityColors[f.severity]+'22', color: severityColors[f.severity], border: `1px solid ${severityColors[f.severity]}44`, width: 'fit-content' }}>{f.severity}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{f.finding}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.remediation.slice(0,80)}...</div>
                    </div>
                    <AlertTriangle size={16} color={severityColors[f.severity]} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
