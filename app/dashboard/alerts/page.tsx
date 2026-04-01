'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, Filter } from 'lucide-react'
import { getDemoData } from '@/lib/demo-data'
import type { Alert } from '@/types'

const sConfig: Record<string,string> = {CRITICAL:'#ef4444',HIGH:'#f97316',MEDIUM:'#f59e0b',LOW:'#84cc16',INFO:'#3b82f6'}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(getDemoData('alerts') as Alert[])
  const [filter, setFilter] = useState('ALL')

  const filtered = filter==='ALL' ? alerts : filter==='UNREAD' ? alerts.filter(a=>!a.isRead) : alerts.filter(a=>a.severity===filter)
  const markRead = (id: string) => setAlerts(a=>a.map(x=>x.id===id?{...x,isRead:true}:x))
  const markAllRead = () => setAlerts(a=>a.map(x=>({...x,isRead:true})))

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div>
          <h1 style={{fontSize:28,fontWeight:700,letterSpacing:'-0.5px',marginBottom:4}}>Alert <span className="text-gradient">Center</span></h1>
          <p style={{color:'var(--text-secondary)',fontSize:14}}>{alerts.filter(a=>!a.isRead).length} unread alerts across your compliance programs</p>
        </div>
        <button onClick={markAllRead} style={{padding:'10px 20px',background:'var(--bg-card)',border:'1px solid var(--border-default)',borderRadius:10,color:'var(--text-secondary)',cursor:'pointer',fontSize:13,fontFamily:'var(--font-display)',display:'flex',alignItems:'center',gap:8}}>
          <Check size={14}/> Mark all read
        </button>
      </div>

      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {['ALL','UNREAD','CRITICAL','HIGH','MEDIUM','LOW','INFO'].map(f=>{
          const c = f==='ALL'||f==='UNREAD'?'#6366f1':sConfig[f]??'#6366f1'
          return <button key={f} onClick={()=>setFilter(f)} style={{padding:'5px 14px',borderRadius:20,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',border:`1px solid ${filter===f?c:'var(--border-subtle)'}`,background:filter===f?c+'22':'transparent',color:filter===f?c:'var(--text-muted)'}}>{f}</button>
        })}
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {filtered.map((alert,i)=>{
          const c = sConfig[alert.severity]??'#6366f1'
          return (
            <motion.div key={alert.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
              style={{padding:'18px 20px',borderRadius:14,background:'var(--bg-card)',border:`1px solid ${alert.isRead?'var(--border-subtle)':c+'33'}`,display:'grid',gridTemplateColumns:'auto 1fr auto',gap:16,alignItems:'flex-start',opacity:alert.isResolved?0.5:1}}>
              <div style={{width:40,height:40,borderRadius:10,background:c+'22',display:'flex',alignItems:'center',justifyContent:'center',color:c}}>
                <Bell size={18}/>
              </div>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                  <span style={{fontSize:12,fontWeight:700,padding:'2px 8px',borderRadius:6,background:c+'22',color:c,textTransform:'uppercase'}}>{alert.severity}</span>
                  <span style={{fontSize:12,color:'var(--text-muted)'}}>{alert.type.replace(/_/g,' ')} · {new Date(alert.createdAt).toLocaleDateString()}</span>
                  {!alert.isRead && <span style={{width:7,height:7,borderRadius:'50%',background:'#6366f1',display:'inline-block'}}/>}
                </div>
                <div style={{fontSize:15,fontWeight:600,marginBottom:4}}>{alert.title}</div>
                <div style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.5}}>{alert.message}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {!alert.isRead && <button onClick={()=>markRead(alert.id)} style={{padding:'6px 12px',background:'var(--bg-surface)',border:'1px solid var(--border-default)',borderRadius:7,color:'var(--text-secondary)',cursor:'pointer',fontSize:12,fontFamily:'var(--font-display)',whiteSpace:'nowrap'}}>Mark read</button>}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
