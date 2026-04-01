'use client'
import dynamic from 'next/dynamic'
const ChainInner = dynamic(() => import('./ChainInner'), { ssr: false, loading: () => (
  <div style={{ width:'100%',height:180,background:'var(--bg-surface)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',fontSize:13 }}>
    Loading blockchain visualization...
  </div>
)})
export default function EvidenceChain() { return <ChainInner /> }