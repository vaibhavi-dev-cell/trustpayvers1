'use client'
import { motion } from 'framer-motion'
import { Settings, Cloud, Shield, Bell, Key, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const inputStyle: React.CSSProperties = {
  width:'100%',padding:'11px 14px',background:'var(--bg-surface)',
  border:'1px solid var(--border-default)',borderRadius:8,color:'var(--text-primary)',
  fontSize:14,fontFamily:'var(--font-display)',outline:'none'
}

export default function SettingsPage() {
  const save = () => toast.success('Settings saved!')
  return (
    <div style={{display:'flex',flexDirection:'column',gap:24,maxWidth:740}}>
      <div>
        <h1 style={{fontSize:28,fontWeight:700,letterSpacing:'-0.5px',marginBottom:4}}>Organization <span className="text-gradient">Settings</span></h1>
        <p style={{color:'var(--text-secondary)',fontSize:14}}>Configure AWS credentials, notifications, and organization details</p>
      </div>

      {[
        {icon:<Settings size={18}/>,title:'Organization',fields:[{label:'Organization Name',val:'Acme Corp'},{label:'Industry',val:'Technology'},{label:'Size',val:'SMB (50-500 employees)'}]},
        {icon:<Cloud size={18}/>,title:'AWS Configuration',fields:[{label:'AWS Account ID',val:'123456789012'},{label:'AWS Region',val:'us-east-1'},{label:'AWS Access Key ID',val:'AKIADEMO...',type:'password'},{label:'AWS Secret Access Key',val:'demo-secret...',type:'password'}]},
        {icon:<Shield size={18}/>,title:'Compliance Frameworks',fields:[]},
        {icon:<Bell size={18}/>,title:'Notifications',fields:[{label:'Alert Email',val:'demo@aegis.dev'}]},
      ].map(section=>(
        <motion.div key={section.title} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
          style={{padding:28,borderRadius:16,background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20,paddingBottom:16,borderBottom:'1px solid var(--border-subtle)'}}>
            <div style={{width:36,height:36,borderRadius:8,background:'rgba(99,102,241,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#6366f1'}}>{section.icon}</div>
            <span style={{fontSize:16,fontWeight:600}}>{section.title}</span>
          </div>
          {section.title==='Compliance Frameworks' ? (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:10}}>
              {['SOC2 Type II','ISO 27001','GDPR','PCI DSS v4','HIPAA'].map((fw,i)=>(
                <label key={fw} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:8,background:'var(--bg-surface)',border:'1px solid var(--border-subtle)',cursor:'pointer'}}>
                  <input type="checkbox" defaultChecked={i<4} style={{accentColor:'#6366f1'}}/>
                  <span style={{fontSize:13,fontWeight:500}}>{fw}</span>
                </label>
              ))}
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {section.fields.map(f=>(
                <div key={f.label}>
                  <label style={{fontSize:13,fontWeight:500,color:'var(--text-secondary)',display:'block',marginBottom:6}}>{f.label}</label>
                  <input defaultValue={f.val} type={f.type??'text'} style={inputStyle}/>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ))}

      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={save}
        style={{padding:'13px 28px',background:'#6366f1',color:'#fff',border:'none',borderRadius:10,fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',display:'flex',alignItems:'center',gap:8,width:'fit-content',boxShadow:'0 0 20px var(--accent-glow)'}}>
        <Save size={16}/> Save Settings
      </motion.button>
    </div>
  )
}
