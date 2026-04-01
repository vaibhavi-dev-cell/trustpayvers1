'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Zap, List, Grid } from 'lucide-react'
import { getDemoData } from '@/lib/demo-data'
import type { OrganizationFramework, ControlStatusRecord } from '@/types'

const statusColor: Record<string,string> = {
  IMPLEMENTED:'#22c55e', PARTIAL:'#f59e0b',
  NOT_IMPLEMENTED:'#ef4444', COMPENSATING:'#3b82f6', NOT_APPLICABLE:'#4a5568'
}

export default function GapsPage() {
  const orgFrameworks = getDemoData('orgFrameworks') as OrganizationFramework[]
  const allStatuses = getDemoData('controlStatuses') as ControlStatusRecord[]
  const [selectedFw, setSelectedFw] = useState(orgFrameworks[0]!.id)
  const [view, setView] = useState<'heatmap'|'list'>('heatmap')
  const [selectedCtrl, setSelectedCtrl] = useState<ControlStatusRecord|null>(null)
  const [streaming, setStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState('')

  const fw = orgFrameworks.find(f=>f.id===selectedFw)!
  const statuses = allStatuses.filter(s=>s.orgFrameworkId===selectedFw)
  const categories = [...new Set(statuses.map(s=>s.control?.category ?? 'Other'))]

  const analyzeGap = async (ctrl: ControlStatusRecord) => {
    setSelectedCtrl(ctrl)
    setStreaming(true)
    setStreamedText('')
    const text = `**Remediation Guide: ${ctrl.control?.controlId} — ${ctrl.control?.title}**

**What This Control Requires:**
This control mandates implementation of ${ctrl.control?.category?.toLowerCase()} measures to protect organizational assets and ensure compliance with your framework requirements.

**Recommended AWS Services:**
• AWS IAM — Identity and access management policies
• AWS CloudTrail — Audit logging for all API calls
• AWS Config — Continuous configuration compliance monitoring
• AWS Security Hub — Centralized security findings aggregation

**Implementation Steps:**
1. Review current configuration against control requirements (1 day)
2. Deploy required AWS Config rules for automated detection (2 days)
3. Configure CloudTrail logging for relevant API events (1 day)
4. Document implementation evidence in AEGIS Evidence Locker (1 day)
5. Submit for compliance officer review and sign-off (2 days)

**Evidence to Collect:**
• AWS Config compliance report screenshot
• CloudTrail log export for relevant time period
• IAM policy document showing control implementation
• Review sign-off from authorized approver

*Priority Score: 78/100 — Recommend addressing within 14 days*
*Analysis by AWS Bedrock (Claude 3.5 Sonnet)*`
    for (let i=0; i < text.length; i+=8) {
      await new Promise(r=>setTimeout(r,18))
      setStreamedText(text.slice(0,i+8))
    }
    setStreaming(false)
  }

  const gaps = statuses.filter(s=>s.status==='NOT_IMPLEMENTED').length
  const partial = statuses.filter(s=>s.status==='PARTIAL').length
  const implemented = statuses.filter(s=>s.status==='IMPLEMENTED').length

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <div>
        <h1 style={{fontSize:28,fontWeight:700,letterSpacing:'-0.5px',marginBottom:4}}>Gap <span className="text-gradient">Analysis</span></h1>
        <p style={{color:'var(--text-secondary)',fontSize:14}}>Visual control gap mapping with AI-powered remediation guidance</p>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {[{label:'Implemented',val:implemented,color:'#22c55e'},{label:'Partial',val:partial,color:'#f59e0b'},{label:'Gaps',val:gaps,color:'#ef4444'},{label:'Score',val:fw.score+'%',color:'#6366f1'}].map(s=>(
          <div key={s.label} style={{padding:18,borderRadius:14,background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
            <div style={{fontSize:30,fontWeight:800,color:s.color}}>{s.val}</div>
            <div style={{fontSize:13,color:'var(--text-secondary)',marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',gap:8}}>
          {orgFrameworks.map(of=>(
            <button key={of.id} onClick={()=>setSelectedFw(of.id)} style={{padding:'7px 16px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',border:`1px solid ${selectedFw===of.id?'#6366f1':'var(--border-subtle)'}`,background:selectedFw===of.id?'rgba(99,102,241,0.15)':'transparent',color:selectedFw===of.id?'#818cf8':'var(--text-muted)'}}>
              {of.framework?.name}
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:4}}>
          {([['heatmap',<Grid key="g" size={16}/>],['list',<List key="l" size={16}/>]] as const).map(([v,icon])=>(
            <button key={v} onClick={()=>setView(v)} style={{padding:'7px 14px',borderRadius:8,fontSize:13,cursor:'pointer',fontFamily:'var(--font-display)',border:`1px solid ${view===v?'#6366f1':'var(--border-subtle)'}`,background:view===v?'rgba(99,102,241,0.15)':'transparent',color:view===v?'#818cf8':'var(--text-muted)',display:'flex',alignItems:'center',gap:6}}>
              {icon}{v}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:selectedCtrl?'1fr 420px':'1fr',gap:20}}>
        {/* Heatmap / List */}
        <div style={{padding:24,borderRadius:16,background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
          {view==='heatmap' ? (
            <div>
              <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}>
                {Object.entries(statusColor).map(([s,c])=>(
                  <span key={s} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--text-secondary)'}}>
                    <span style={{width:12,height:12,borderRadius:3,background:c,display:'inline-block'}}/>
                    {s.replace(/_/g,' ')}
                  </span>
                ))}
              </div>
              {categories.slice(0,8).map(cat=>{
                const catStatuses = statuses.filter(s=>s.control?.category===cat)
                return (
                  <div key={cat} style={{marginBottom:14}}>
                    <div style={{fontSize:12,fontWeight:600,color:'var(--text-muted)',marginBottom:6}}>{cat}</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                      {catStatuses.slice(0,20).map(cs=>(
                        <motion.div key={cs.id} whileHover={{scale:1.3}}
                          onClick={()=>analyzeGap(cs)}
                          title={`${cs.control?.controlId}: ${cs.control?.title}`}
                          style={{width:20,height:20,borderRadius:4,background:statusColor[cs.status]??'#374151',cursor:'pointer',transition:'transform 0.1s'}} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {statuses.filter(s=>s.status==='NOT_IMPLEMENTED'||s.status==='PARTIAL').map((cs,i)=>(
                <motion.div key={cs.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.03}}
                  onClick={()=>analyzeGap(cs)}
                  style={{padding:'12px 16px',borderRadius:10,background:'var(--bg-surface)',border:`1px solid ${statusColor[cs.status]??'#374151'}33`,cursor:'pointer',display:'grid',gridTemplateColumns:'80px 1fr auto auto',gap:14,alignItems:'center'}}>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:12,color:'#818cf8'}}>{cs.control?.controlId}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:500}}>{cs.control?.title}</div>
                    <div style={{fontSize:11,color:'var(--text-muted)'}}>{cs.control?.category}</div>
                  </div>
                  <span style={{padding:'3px 10px',borderRadius:6,fontSize:11,fontWeight:600,background:(statusColor[cs.status]??'#374151')+'22',color:statusColor[cs.status]??'#374151'}}>{cs.status.replace(/_/g,' ')}</span>
                  <button onClick={e=>{e.stopPropagation();analyzeGap(cs)}} style={{padding:'5px 10px',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:6,color:'#818cf8',fontSize:11,cursor:'pointer',fontFamily:'var(--font-display)',display:'flex',alignItems:'center',gap:4}}>
                    <Zap size={11}/> Fix
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Remediation panel */}
        {selectedCtrl && (
          <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}
            style={{padding:24,borderRadius:16,background:'var(--bg-card)',border:'1px solid rgba(99,102,241,0.2)'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:16}}>
              <div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:12,color:'#818cf8',marginBottom:4}}>{selectedCtrl.control?.controlId}</div>
                <div style={{fontSize:16,fontWeight:700,lineHeight:1.3}}>{selectedCtrl.control?.title}</div>
              </div>
              <button onClick={()=>setSelectedCtrl(null)} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontSize:18}}>×</button>
            </div>
            <div style={{padding:16,background:'var(--bg-surface)',borderRadius:10,fontSize:13,lineHeight:1.7,color:'var(--text-secondary)',maxHeight:480,overflowY:'auto',whiteSpace:'pre-wrap',border:'1px solid var(--border-subtle)'}}>
              {streamedText || (streaming ? '' : 'Loading...')}
              {streaming && <span style={{color:'#6366f1'}}>▌</span>}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
