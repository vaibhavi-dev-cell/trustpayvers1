'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Plus, Loader2 } from 'lucide-react'
import { getDemoData } from '@/lib/demo-data'
import type { Report } from '@/types'
import toast from 'react-hot-toast'

const typeLabels: Record<string,string> = {
  gap_analysis:'Gap Analysis',evidence_summary:'Evidence Summary',
  regulatory_impact:'Regulatory Impact',full_audit:'Full Audit Package'
}

export default function ReportsPage() {
  const reports = getDemoData('reports') as Report[]
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showNew, setShowNew] = useState(false)
  const [selType, setSelType] = useState('gap_analysis')
  const [selFw, setSelFw] = useState('SOC2')

  const generateReport = async () => {
    setShowNew(false)
    setGenerating(true)
    setProgress(0)
    for (let i=0; i<=100; i+=5) {
      await new Promise(r=>setTimeout(r,120))
      setProgress(i)
    }
    setGenerating(false)
    toast.success('Report generated! Ready for download.')
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:28,fontWeight:700,letterSpacing:'-0.5px',marginBottom:4}}>Audit <span className="text-gradient">Reports</span></h1>
          <p style={{color:'var(--text-secondary)',fontSize:14}}>AI-generated audit-ready reports with blockchain-anchored evidence</p>
        </div>
        <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>setShowNew(true)}
          style={{padding:'11px 20px',background:'#6366f1',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',display:'flex',alignItems:'center',gap:8,boxShadow:'0 0 20px var(--accent-glow)'}}>
          <Plus size={16}/> Generate Report
        </motion.button>
      </div>

      {generating && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{padding:24,borderRadius:16,background:'var(--bg-card)',border:'1px solid rgba(99,102,241,0.3)'}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
            <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1.5,ease:'linear'}}><Loader2 size={20} color="#6366f1"/></motion.div>
            <span style={{fontWeight:600}}>Generating report... {progress}%</span>
          </div>
          <div style={{height:8,borderRadius:4,background:'var(--bg-surface)',overflow:'hidden'}}>
            <motion.div animate={{width:`${progress}%`}} style={{height:'100%',borderRadius:4,background:'linear-gradient(90deg,#6366f1,#8b5cf6)'}}/>
          </div>
          <div style={{marginTop:12,fontSize:13,color:'var(--text-secondary)'}}>
            {progress < 30 ? 'Fetching compliance data...' : progress < 60 ? 'Generating AI executive summary...' : progress < 85 ? 'Compiling evidence appendix...' : 'Finalizing PDF...'}
          </div>
        </motion.div>
      )}

      {showNew && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <motion.div initial={{scale:0.95}} animate={{scale:1}} style={{width:'100%',maxWidth:500,background:'var(--bg-card)',borderRadius:20,border:'1px solid var(--border-default)',padding:32}}>
            <h2 style={{fontSize:20,fontWeight:700,marginBottom:20}}>New Report</h2>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:8}}>Report Type</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {Object.entries(typeLabels).map(([k,v])=>(
                  <button key={k} onClick={()=>setSelType(k)} style={{padding:'10px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',border:`1px solid ${selType===k?'#6366f1':'var(--border-subtle)'}`,background:selType===k?'rgba(99,102,241,0.15)':'var(--bg-surface)',color:selType===k?'#818cf8':'var(--text-secondary)',textAlign:'center'}}>{v}</button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{fontSize:13,fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:8}}>Framework</label>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {['SOC2','GDPR','ISO27001','PCI_DSS','ALL'].map(fw=>(
                  <button key={fw} onClick={()=>setSelFw(fw)} style={{padding:'6px 14px',borderRadius:6,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',border:`1px solid ${selFw===fw?'#6366f1':'var(--border-subtle)'}`,background:selFw===fw?'rgba(99,102,241,0.15)':'transparent',color:selFw===fw?'#818cf8':'var(--text-muted)'}}>{fw}</button>
                ))}
              </div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setShowNew(false)} style={{flex:1,padding:'12px',background:'var(--bg-surface)',border:'1px solid var(--border-default)',borderRadius:10,color:'var(--text-secondary)',cursor:'pointer',fontFamily:'var(--font-display)'}}>Cancel</button>
              <motion.button whileHover={{scale:1.02}} onClick={generateReport} style={{flex:2,padding:'12px',background:'#6366f1',border:'none',borderRadius:10,color:'#fff',fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',fontSize:14}}>Generate</motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {reports.map((r,i)=>(
          <motion.div key={r.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
            style={{padding:'18px 22px',borderRadius:14,background:'var(--bg-card)',border:'1px solid var(--border-subtle)',display:'grid',gridTemplateColumns:'auto 1fr auto',gap:16,alignItems:'center'}}>
            <div style={{width:44,height:44,borderRadius:12,background:'rgba(99,102,241,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#6366f1'}}>
              <FileText size={20}/>
            </div>
            <div>
              <div style={{fontSize:16,fontWeight:600,marginBottom:4}}>{r.title}</div>
              <div style={{display:'flex',gap:12,fontSize:12,color:'var(--text-muted)'}}>
                <span>{typeLabels[r.type]??r.type}</span>
                <span>{r.framework}</span>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                <span style={{padding:'2px 8px',borderRadius:4,background:'rgba(34,197,94,0.15)',color:'#22c55e',fontWeight:600}}>{r.status}</span>
              </div>
            </div>
            <button style={{padding:'9px 18px',background:'var(--bg-surface)',border:'1px solid var(--border-default)',borderRadius:8,color:'var(--text-primary)',cursor:'pointer',fontSize:13,fontFamily:'var(--font-display)',display:'flex',alignItems:'center',gap:8}}>
              <Download size={14}/> Download PDF
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
