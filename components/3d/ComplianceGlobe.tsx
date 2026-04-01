'use client'
import dynamic from 'next/dynamic'
const GlobeInner = dynamic(() => import('./GlobeInner'), { ssr: false, loading: () => (
  <div style={{ width:'100%',height:300,borderRadius:16,background:'radial-gradient(circle at 50% 50%,rgba(99,102,241,0.1) 0%,transparent 70%)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',fontSize:14 }}>
    Loading 3D Globe...
  </div>
)})
export default function ComplianceGlobe() { return <GlobeInner /> }