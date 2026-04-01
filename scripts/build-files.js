const fs = require('fs');
const path = require('path');
const BASE = 'c:/Users/vaibh/Downloads/aaa/aegis';
function write(filePath, content) {
  const fullPath = path.join(BASE, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('WROTE:', filePath);
}

// Fix globals.css — Next.js 16 uses @import "tailwindcss" differently
write('app/globals.css', [
"@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');",
"",
"@tailwind base;",
"@tailwind components;",
"@tailwind utilities;",
"",
":root {",
"  --font-display: 'Space Grotesk', sans-serif;",
"  --font-mono: 'IBM Plex Mono', monospace;",
"  --bg-base: #080c14;",
"  --bg-surface: #0d1525;",
"  --bg-card: #111a2e;",
"  --bg-card-hover: #162035;",
"  --bg-overlay: rgba(13,21,37,0.85);",
"  --border-subtle: rgba(255,255,255,0.06);",
"  --border-default: rgba(255,255,255,0.10);",
"  --border-strong: rgba(255,255,255,0.18);",
"  --text-primary: #e8edf4;",
"  --text-secondary: #8a95a8;",
"  --text-muted: #4a5568;",
"  --color-compliant: #22c55e;",
"  --color-partial: #f59e0b;",
"  --color-gap: #ef4444;",
"  --color-info: #3b82f6;",
"  --risk-critical: #ef4444;",
"  --risk-high: #f97316;",
"  --risk-medium: #f59e0b;",
"  --risk-low: #84cc16;",
"  --risk-none: #22c55e;",
"  --glass: rgba(255,255,255,0.02);",
"  --glass-border: rgba(255,255,255,0.05);",
"  --sidebar-w: 260px;",
"  --topbar-h: 64px;",
"  --content-max: 1400px;",
"  --accent: #6366f1;",
"  --accent-light: #818cf8;",
"  --accent-glow: rgba(99,102,241,0.3);",
"}",
"*{margin:0;padding:0;box-sizing:border-box;}",
"html{color-scheme:dark;}",
"body{font-family:var(--font-display);background:var(--bg-base);color:var(--text-primary);min-height:100vh;-webkit-font-smoothing:antialiased;}",
"::-webkit-scrollbar{width:6px;height:6px;}",
"::-webkit-scrollbar-track{background:transparent;}",
"::-webkit-scrollbar-thumb{background:var(--border-default);border-radius:3px;}",
"::-webkit-scrollbar-thumb:hover{background:var(--border-strong);}",
"@keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}",
".skeleton{background:linear-gradient(90deg,var(--bg-card) 25%,var(--bg-card-hover) 50%,var(--bg-card) 75%);background-size:200% 100%;animation:shimmer 1.5s ease-in-out infinite;border-radius:8px;}",
"@keyframes pulse-glow{0%,100%{box-shadow:0 0 15px var(--accent-glow);}50%{box-shadow:0 0 30px var(--accent-glow),0 0 60px rgba(99,102,241,0.15);}}",
".glow{animation:pulse-glow 3s ease-in-out infinite;}",
"@keyframes page-enter{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}",
".page-enter{animation:page-enter 0.4s ease-out;}",
".glass-card{background:var(--glass);border:1px solid var(--glass-border);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}",
".text-gradient{background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}",
].join('\n'));

// Fix tailwind.config.ts for Next.js 16
write('tailwind.config.ts', [
"import type { Config } from 'tailwindcss'",
"const config: Config = {",
"  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],",
"  theme: {",
"    extend: {",
"      colors: {",
"        accent: '#6366f1',",
"        'bg-base': '#080c14',",
"        'bg-surface': '#0d1525',",
"        'bg-card': '#111a2e',",
"      },",
"    },",
"  },",
"  plugins: [],",
"}",
"export default config",
].join('\n'));

// Fix postcss.config.mjs for tailwind v3
write('postcss.config.mjs', [
"/** @type {import('postcss-load-config').Config} */",
"const config = {",
"  plugins: {",
"    tailwindcss: {},",
"    autoprefixer: {},",
"  },",
"};",
"export default config;",
].join('\n'));

// Rewrite dashboard page with fixed 4-col KPI grid
write('app/dashboard/page.tsx', `'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle2, Zap, TrendingUp, Clock, Activity } from 'lucide-react'
import { getDemoData } from '@/lib/demo-data'
import type { OrganizationFramework, Alert, RegulatoryChange } from '@/types'
import dynamic from 'next/dynamic'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts'

const RiskOrb = dynamic(() => import('@/components/3d/RiskOrb'), {
  ssr: false,
  loading: () => <div style={{width:'100%',height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.2),transparent)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',fontSize:13}}>Loading orb...</div>
})

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

function KPICard({ label, value, suffix = '', icon, color, change }: {
  label: string; value: number; suffix?: string; icon: React.ReactNode; color: string; change?: string
}) {
  const display = useCountUp(value)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      style={{ padding: 24, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', transition: 'border-color 0.2s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color + '44'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
    >
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: color + '08', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
      </div>
      <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, marginBottom: 8, letterSpacing: '-2px', color: 'var(--text-primary)' }}>
        {display}{suffix}
      </div>
      {change && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{change}</div>}
    </motion.div>
  )
}

const radarData = [
  { subject: 'SOC 2', score: 72 },
  { subject: 'ISO 27001', score: 58 },
  { subject: 'GDPR', score: 89 },
  { subject: 'PCI DSS', score: 24 },
  { subject: 'HIPAA', score: 45 },
]

const trendData = [
  { month: 'Jul', score: 42 }, { month: 'Aug', score: 48 }, { month: 'Sep', score: 53 },
  { month: 'Oct', score: 58 }, { month: 'Nov', score: 62 }, { month: 'Dec', score: 67 },
]

const impactColors: Record<string, string> = {
  URGENT: '#ef4444', ACTION_REQUIRED: '#f59e0b', MONITOR: '#3b82f6', NONE: '#6b7280'
}
const severityColors: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#84cc16', INFO: '#3b82f6'
}

export default function DashboardPage() {
  const orgFrameworks = getDemoData('orgFrameworks') as OrganizationFramework[]
  const alerts = getDemoData('alerts') as Alert[]
  const regChanges = getDemoData('regulatoryChanges') as RegulatoryChange[]
  const kpis = getDemoData('kpis') as { complianceScore: number; openGaps: number; evidenceCount: number; pendingActions: number }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6 }}>
          Compliance <span className="text-gradient">Overview</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Acme Corp · Last scan: 1 hour ago · <span style={{ color: '#22c55e', fontSize: 12, padding: '2px 8px', borderRadius: 4, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>Demo Mode</span>
        </p>
      </motion.div>

      {/* 4 KPI cards — fixed 4-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KPICard label="Compliance Score" value={kpis.complianceScore} suffix="%" icon={<Shield size={18}/>} color="#6366f1" change="↑ 5% vs last month" />
        <KPICard label="Open Gaps" value={kpis.openGaps} icon={<AlertTriangle size={18}/>} color="#ef4444" change="12 resolved this week" />
        <KPICard label="Evidence Items" value={kpis.evidenceCount} icon={<CheckCircle2 size={18}/>} color="#22c55e" change="38 anchored to blockchain" />
        <KPICard label="Pending Actions" value={kpis.pendingActions} icon={<Zap size={18}/>} color="#f59e0b" change="From 6 regulatory changes" />
      </div>

      {/* Radar + Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Activity size={18} color="#6366f1" />
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Framework Compliance Radar</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#8a95a8', fontSize: 12 }} />
              <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <AlertTriangle size={18} color="#ef4444" />
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Recent Alerts</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.slice(0, 5).map(alert => (
              <motion.div key={alert.id} whileHover={{ x: 2 }}
                style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: (severityColors[alert.severity] ?? '#6b7280') + '22', color: severityColors[alert.severity] ?? '#6b7280', border: '1px solid ' + (severityColors[alert.severity] ?? '#6b7280') + '44' }}>{alert.severity}</span>
                  {!alert.isRead && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{alert.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend + Reg Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <TrendingUp size={18} color="#22c55e" />
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Compliance Score Trend</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#8a95a8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[30, 100]} tick={{ fill: '#8a95a8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8 }} />
              <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#scoreGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Clock size={18} color="#3b82f6" />
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Regulatory Intelligence Feed</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {regChanges.slice(0, 4).map(change => (
              <motion.div key={change.id} whileHover={{ x: 2 }}
                style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: (impactColors[change.impact] ?? '#6b7280') + '22', color: impactColors[change.impact] ?? '#6b7280', border: '1px solid ' + (impactColors[change.impact] ?? '#6b7280') + '44' }}>
                    {change.impact.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{change.jurisdiction}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{change.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Framework Cards */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.3px' }}>Active Frameworks</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {orgFrameworks.map((of, i) => {
            const c = of.score > 75 ? '#22c55e' : of.score > 50 ? '#f59e0b' : '#ef4444'
            return (
              <motion.div key={of.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3 }}
                style={{ padding: 22, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = c + '44'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 3 }}>{of.framework?.displayName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{of.status.replace(/_/g, ' ')}</div>
                  </div>
                  <span style={{ fontSize: 26, fontWeight: 900, color: c, letterSpacing: '-1px' }}>{of.score}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-surface)', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: of.score + '%' }} transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,' + c + ',' + c + '88)' }} />
                </div>
                {of.targetDate && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
                    Target: {new Date(of.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
`);

// Install autoprefixer if missing
console.log('Dashboard & CSS fixes written');
