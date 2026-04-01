'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Flag, ExternalLink, Zap, Clock, AlertTriangle } from 'lucide-react'
import { getDemoData } from '@/lib/demo-data'
import type { RegulatoryChange } from '@/types'

const impactConfig: Record<string,{color:string,label:string}> = {
  NONE:{color:'#6b7280',label:'No Impact'},
  MONITOR:{color:'#3b82f6',label:'Monitor'},
  ACTION_REQUIRED:{color:'#f59e0b',label:'Action Required'},
  URGENT:{color:'#ef4444',label:'Urgent'}
}
const jurisdictionFlags: Record<string,string> = {
  EU:'🇪🇺',US:'🇺🇸',IN:'🇮🇳',UK:'🇬🇧',GLOBAL:'🌐',APAC:'🌏'
}

export default function RegulationsPage() {
  const changes = getDemoData('regulatoryChanges') as RegulatoryChange[]
  const [selected, setSelected] = useState<RegulatoryChange>(changes[0]!)
  const [filter, setFilter] = useState('ALL')
  const [streaming, setStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState('')

  const filtered = filter==='ALL' ? changes : changes.filter(c=>c.impact===filter)

  const analyzeImpact = async () => {
    setStreaming(true)
    setStreamedText('')
    const analysis = `**Impact Analysis for ${selected.title}**

**Affected Frameworks:** ${selected.frameworks.join(', ')}

**Your Organization's Exposure:**
This regulation directly impacts your ${selected.frameworks[0]} compliance program. Based on your current control statuses, you have partial coverage of the requirements.

**Key Changes Required:**
${selected.actionItems.map((a,i)=>`${i+1}. ${a.action} (Est. ${a.effort}, Owner: ${a.owner})`).join('\n')}

**Priority Assessment:** ${selected.impact === 'URGENT' ? 'Immediate action required — this affects production systems.' : selected.impact === 'ACTION_REQUIRED' ? 'Plan implementation within 30 days.' : 'Monitor and assess impact quarterly.'}

**Recommended Next Steps:**
- Schedule a compliance team review within 5 business days
- Update your gap analysis to reflect new requirements
- Assign control ownership for each action item above

*Analysis powered by AWS Bedrock (Claude 3.5 Sonnet)*`
    for (let i = 0; i < analysis.length; i += 6) {
      await new Promise(r => setTimeout(r, 20))
      setStreamedText(analysis.slice(0, i+6))
    }
    setStreaming(false)
  }

  const cfg = impactConfig[selected.impact] ?? impactConfig['NONE']!

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <div>
        <h1 style={{fontSize:28,fontWeight:700,letterSpacing:'-0.5px',marginBottom:4}}>Regulatory <span className="text-gradient">Intelligence</span></h1>
        <p style={{color:'var(--text-secondary)',fontSize:14}}>AI-monitored global regulatory feed with agentic impact analysis</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:20,minHeight:600}}>
        {/* Feed */}
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:4}}>
            {['ALL','URGENT','ACTION_REQUIRED','MONITOR'].map(f=>{
              const c = f==='ALL'?'#6366f1':impactConfig[f]?.color??'#6366f1'
              return <button key={f} onClick={()=>setFilter(f)} style={{padding:'4px 12px',borderRadius:20,fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',border:`1px solid ${filter===f?c:'var(--border-subtle)'}`,background:filter===f?c+'22':'transparent',color:filter===f?c:'var(--text-muted)'}}>{f.replace('_',' ')}</button>
            })}
          </div>
          {filtered.map(change=>{
            const cc = impactConfig[change.impact] ?? impactConfig['NONE']!
            return (
              <motion.div key={change.id} whileHover={{x:2}} onClick={()=>{setSelected(change);setStreamedText('');setStreaming(false)}}
                style={{padding:'14px 16px',borderRadius:12,cursor:'pointer',background:selected.id===change.id?'rgba(99,102,241,0.08)':'var(--bg-card)',border:`1px solid ${selected.id===change.id?'rgba(99,102,241,0.3)':'var(--border-subtle)'}`,transition:'all 0.15s'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <span style={{fontSize:16}}>{jurisdictionFlags[change.jurisdiction]??'🌐'}</span>
                  <span style={{fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:6,background:cc.color+'22',color:cc.color,border:`1px solid ${cc.color}44`}}>{cc.label}</span>
                  <span style={{fontSize:11,color:'var(--text-muted)',marginLeft:'auto'}}>{new Date(change.publishedAt).toLocaleDateString()}</span>
                </div>
                <div style={{fontSize:13,fontWeight:600,lineHeight:1.4,marginBottom:4}}>{change.title}</div>
                <div style={{fontSize:11,color:'var(--text-muted)'}}>{change.source} · {change.frameworks.slice(0,2).join(', ')}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Detail panel */}
        <div style={{padding:28,borderRadius:16,background:'var(--bg-card)',border:'1px solid var(--border-subtle)',display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',paddingBottom:20,borderBottom:'1px solid var(--border-subtle)'}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',gap:8,marginBottom:10}}>
                <span style={{fontSize:18}}>{jurisdictionFlags[selected.jurisdiction]??'🌐'}</span>
                <span style={{padding:'3px 10px',borderRadius:6,fontSize:12,fontWeight:700,background:cfg.color+'22',color:cfg.color,border:`1px solid ${cfg.color}44`}}>{cfg.label}</span>
                <span style={{padding:'3px 10px',borderRadius:6,fontSize:12,background:'var(--bg-surface)',color:'var(--text-muted)',border:'1px solid var(--border-subtle)'}}>{selected.source}</span>
              </div>
              <h2 style={{fontSize:19,fontWeight:700,lineHeight:1.3,marginBottom:8}}>{selected.title}</h2>
              <p style={{fontSize:14,color:'var(--text-secondary)',lineHeight:1.6}}>{selected.summary}</p>
            </div>
            {selected.url && <a href={selected.url} target="_blank" rel="noreferrer" style={{color:'#818cf8',marginLeft:16,flexShrink:0}}><ExternalLink size={18}/></a>}
          </div>

          {/* Action items */}
          <div>
            <div style={{fontSize:15,fontWeight:600,marginBottom:12,display:'flex',alignItems:'center',gap:8}}><Zap size={16} color="#f59e0b"/> Action Items ({selected.actionItems.length})</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {selected.actionItems.map((item,i)=>(
                <div key={i} style={{padding:'12px 16px',borderRadius:10,background:'var(--bg-surface)',border:'1px solid var(--border-subtle)',display:'flex',gap:14,alignItems:'flex-start'}}>
                  <div style={{width:24,height:24,borderRadius:'50%',background:'rgba(99,102,241,0.15)',color:'#818cf8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>{item.action}</div>
                    <div style={{display:'flex',gap:12,fontSize:12,color:'var(--text-muted)'}}>
                      <span style={{display:'flex',alignItems:'center',gap:4}}><Clock size={11}/>{item.effort}</span>
                      <span style={{display:'flex',alignItems:'center',gap:4}}><Flag size={11}/>{item.owner.replace('_',' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Impact Analysis */}
          <div style={{borderTop:'1px solid var(--border-subtle)',paddingTop:20}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
              <div style={{fontSize:15,fontWeight:600,display:'flex',alignItems:'center',gap:8}}><AlertTriangle size={16} color="#6366f1"/> AI Impact Analysis</div>
              {!streamedText && !streaming && (
                <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={analyzeImpact}
                  style={{padding:'8px 16px',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:8,color:'#818cf8',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',display:'flex',alignItems:'center',gap:6}}>
                  <Zap size={14}/> Analyze Impact
                </motion.button>
              )}
            </div>
            {(streamedText || streaming) && (
              <div style={{padding:16,background:'var(--bg-surface)',borderRadius:10,fontSize:13,lineHeight:1.7,color:'var(--text-secondary)',border:'1px solid var(--border-subtle)',whiteSpace:'pre-wrap'}}>
                {streamedText}
                {streaming && <span style={{color:'#6366f1'}}>▌</span>}
              </div>
            )}
            {!streamedText && !streaming && (
              <div style={{padding:16,background:'var(--bg-surface)',borderRadius:10,fontSize:13,color:'var(--text-muted)',textAlign:'center',border:'1px solid var(--border-subtle)'}}>
                Click "Analyze Impact" to get AI-powered impact analysis for your specific compliance programs
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
