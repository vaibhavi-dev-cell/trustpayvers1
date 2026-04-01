'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Link, CheckCircle2, Clock, Upload, Lock } from 'lucide-react'
import { getDemoData } from '@/lib/demo-data'
import type { Evidence } from '@/types'
import toast from 'react-hot-toast'

const typeIcons: Record<string,React.ReactNode> = {
  CLOUDTRAIL_LOG: <Clock size={16}/>, CONFIG_SNAPSHOT: <Shield size={16}/>,
  SECURITY_HUB_FINDING: <Lock size={16}/>, MANUAL_UPLOAD: <Upload size={16}/>,
  POLICY_DOCUMENT: <Shield size={16}/>, SCREENSHOT: <Upload size={16}/>
}
const statusConfig: Record<string,{color:string,label:string}> = {
  COLLECTED:{color:'#8a95a8',label:'Collected'},
  ANCHORED:{color:'#6366f1',label:'Anchored'},
  VERIFIED:{color:'#22c55e',label:'Verified'}
}

import EvidenceChain from '@/components/3d/EvidenceChain'

export default function EvidencePage() {
  const evidence = getDemoData('evidence') as Evidence[]
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [anchoring, setAnchoring] = useState(false)
  const [filter, setFilter] = useState('ALL')

  const filtered = filter === 'ALL' ? evidence : evidence.filter(e => e.status === filter)
  const toggleSelect = (id: string) => setSelectedIds(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id])

  const anchorSelected = async () => {
    setAnchoring(true)
    await new Promise(r => setTimeout(r, 2000))
    toast.success(`${selectedIds.length} items anchored to Polygon blockchain!`)
    setAnchoring(false)
    setSelectedIds([])
  }

  const stats = {
    total: evidence.length,
    anchored: evidence.filter(e=>e.status!=='COLLECTED').length,
    verified: evidence.filter(e=>e.status==='VERIFIED').length,
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:28,fontWeight:700,letterSpacing:'-0.5px',marginBottom:4}}>Evidence <span className="text-gradient">Locker</span></h1>
          <p style={{color:'var(--text-secondary)',fontSize:14}}>Tamper-proof evidence anchored to Polygon blockchain</p>
        </div>
        {selectedIds.length > 0 && (
          <motion.button initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
            onClick={anchorSelected} disabled={anchoring}
            style={{padding:'11px 20px',background:'#6366f1',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',display:'flex',alignItems:'center',gap:8,boxShadow:'0 0 20px var(--accent-glow)'}}>
            {anchoring ? <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1,ease:'linear'}}><Shield size={16}/></motion.div> : <Link size={16}/>}
            {anchoring ? 'Anchoring...' : `Anchor ${selectedIds.length} to Blockchain`}
          </motion.button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 20 }}>
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16}}>
          {[{label:'Total Evidence',val:stats.total,color:'#6366f1'},{label:'Blockchain Anchored',val:stats.anchored,color:'#8b5cf6'},{label:'Verified',val:stats.verified,color:'#22c55e'}].map(s=>(
            <div key={s.label} style={{padding:20,borderRadius:14,background:'var(--bg-card)',border:'1px solid var(--border-subtle)',display:'flex',flexDirection:'column',justifyContent:'center'}}>
              <div style={{fontSize:36,fontWeight:800,color:s.color,marginBottom:4}}>{s.val}</div>
              <div style={{fontSize:13,color:'var(--text-secondary)',fontWeight:500}}>{s.label}</div>
            </div>
          ))}
        </div>
        
        {/* 3D Visualization */}
        <div style={{ padding: 16, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 12, left: 16, fontSize: 13, fontWeight: 600, zIndex: 10 }}>Polygon Network</div>
          <EvidenceChain />
        </div>
      </div>


      {/* Filter */}
      <div style={{display:'flex',gap:8}}>
        {['ALL','COLLECTED','ANCHORED','VERIFIED'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:'6px 16px',borderRadius:20,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',border:`1px solid ${filter===f?'#6366f1':'var(--border-subtle)'}`,background:filter===f?'rgba(99,102,241,0.15)':'transparent',color:filter===f?'#818cf8':'var(--text-muted)'}}>
            {f}
          </button>
        ))}
        <span style={{marginLeft:'auto',fontSize:13,color:'var(--text-muted)',alignSelf:'center'}}>{filtered.length} items</span>
      </div>

      {/* Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:14}}>
        {filtered.map((ev,i)=>{
          const cfg = statusConfig[ev.status] ?? statusConfig['COLLECTED']!
          const sel = selectedIds.includes(ev.id)
          return (
            <motion.div key={ev.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.02}}
              style={{padding:18,borderRadius:14,background:'var(--bg-card)',border:`1px solid ${sel?'rgba(99,102,241,0.4)':'var(--border-subtle)'}`,cursor:'pointer',transition:'border-color 0.15s'}}
              onClick={()=>toggleSelect(ev.id)}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border-default)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor=sel?'rgba(99,102,241,0.4)':'var(--border-subtle)'}>
              <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10}}>
                <div style={{width:32,height:32,borderRadius:8,background:'rgba(99,102,241,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#818cf8',flexShrink:0}}>
                  {typeIcons[ev.type] ?? <Shield size={16}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ev.title}</div>
                  <div style={{fontSize:11,color:'var(--text-muted)'}}>{ev.type.replace(/_/g,' ')} · {new Date(ev.collectedAt).toLocaleDateString()}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:4,padding:'3px 8px',borderRadius:6,fontSize:11,fontWeight:600,background:cfg.color+'22',color:cfg.color,border:`1px solid ${cfg.color}44`,flexShrink:0}}>
                  {ev.status==='VERIFIED'?<CheckCircle2 size={10}/>:ev.status==='ANCHORED'?<Link size={10}/>:<Clock size={10}/>}
                  {cfg.label}
                </div>
              </div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',padding:'6px 10px',background:'var(--bg-surface)',borderRadius:6}}>
                SHA-256: {ev.contentHash}
              </div>
              {ev.blockchainTx && (
                <div style={{marginTop:8,fontFamily:'var(--font-mono)',fontSize:10,color:'#818cf8',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  Polygon: {ev.blockchainTx.slice(0,20)}...
                </div>
              )}
              {sel && <div style={{position:'absolute',top:10,right:10,width:18,height:18,borderRadius:'50%',background:'#6366f1',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11}}>✓</div>}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
