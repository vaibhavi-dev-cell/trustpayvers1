'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ScanSearch, FileText, Shield, BarChart3,
  Globe, Download, Bell, Settings, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { getDemoData } from '@/lib/demo-data'

const navItems = [
  { title: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Infrastructure Scan', href: '/dashboard/scan', icon: ScanSearch },
  { title: 'Policies', href: '/dashboard/policies', icon: FileText },
  { title: 'Evidence Locker', href: '/dashboard/evidence', icon: Shield },
  { title: 'Gap Analysis', href: '/dashboard/gaps', icon: BarChart3 },
  { title: 'Regulations', href: '/dashboard/regulations', icon: Globe },
  { title: 'Reports', href: '/dashboard/reports', icon: Download },
  { title: 'Alerts', href: '/dashboard/alerts', icon: Bell },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [unreadAlerts, setUnreadAlerts] = useState(0)

  useEffect(() => {
    const count = getDemoData('unreadAlerts') as number
    setUnreadAlerts(count)
  }, [])

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      style={{
        height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 40,
        background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 16px' : '20px 24px', display: 'flex',
        alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-subtle)',
        minHeight: 65,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Shield size={20} color="#fff" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }}
              style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}
              className="text-gradient"
            >
              Trustpay-AEGIS
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 2 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: collapsed ? '12px 0' : '10px 16px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 10, position: 'relative', cursor: 'pointer',
                  background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: active ? '#818cf8' : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                }}
              >
                {active && (
                  <motion.div layoutId="activeTab" style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3,
                    background: '#6366f1', borderRadius: '0 2px 2px 0',
                  }} />
                )}
                <Icon size={20} style={{ flexShrink: 0 }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 14, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.title === 'Alerts' && unreadAlerts > 0 && (
                  <span style={{
                    position: collapsed ? 'absolute' : 'relative',
                    right: collapsed ? 8 : 'auto', top: collapsed ? 6 : 'auto',
                    marginLeft: collapsed ? 0 : 'auto',
                    padding: '2px 7px', fontSize: 11, fontWeight: 700,
                    background: '#ef4444', color: '#fff', borderRadius: 10, minWidth: 20,
                    textAlign: 'center',
                  }}>
                    {unreadAlerts}
                  </span>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)' }}>
        {!collapsed && (
          <div style={{
            padding: '10px 16px', marginBottom: 8, borderRadius: 10,
            background: 'var(--bg-card)', fontSize: 13,
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Acme Corp</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Sarah Chen · Owner</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          width: '100%', padding: '10px 16px', background: 'none',
          border: '1px solid var(--border-subtle)', borderRadius: 10,
          color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13,
          fontFamily: 'var(--font-display)', transition: 'all 0.15s',
        }}>
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> Collapse</>}
        </button>
      </div>
    </motion.aside>
  )
}
