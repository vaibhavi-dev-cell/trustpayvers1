'use client'

import { Bell, Search, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDemoData } from '@/lib/demo-data'
import type { Alert } from '@/types'

export default function TopBar() {
  const pathname = usePathname()
  const [showNotifs, setShowNotifs] = useState(false)
  const alerts = getDemoData('alerts') as Alert[]
  const unread = alerts.filter(a => !a.isRead)

  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    href: '/' + segments.slice(0, i + 1).join('/'),
  }))

  return (
    <header style={{
      height: 'var(--topbar-h)', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 32px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 30,
    }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {breadcrumbs.map((crumb, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <ChevronRight size={14} color="var(--text-muted)" />}
            <span style={{
              fontSize: 14, fontWeight: i === breadcrumbs.length - 1 ? 600 : 400,
              color: i === breadcrumbs.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
            }}>
              {crumb.label}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Search */}
        <button style={{
          padding: '8px 14px', background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)', borderRadius: 8,
          color: 'var(--text-muted)', cursor: 'pointer', display: 'flex',
          alignItems: 'center', gap: 8, fontSize: 13, fontFamily: 'var(--font-display)',
        }}>
          <Search size={14} /> <span>Search...</span>
          <kbd style={{
            padding: '2px 6px', background: 'var(--bg-surface)',
            borderRadius: 4, fontSize: 11, color: 'var(--text-muted)',
            border: '1px solid var(--border-default)',
          }}>⌘K</kbd>
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={{
              width: 40, height: 40, borderRadius: 10, display: 'flex',
              alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)', cursor: 'pointer', position: 'relative',
              color: 'var(--text-secondary)',
            }}
          >
            <Bell size={18} />
            {unread.length > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6, width: 8, height: 8,
                background: '#ef4444', borderRadius: '50%', border: '2px solid var(--bg-surface)',
              }} />
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                style={{
                  position: 'absolute', right: 0, top: 48, width: 360,
                  background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                  borderRadius: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  overflow: 'hidden', zIndex: 50,
                }}
              >
                <div style={{
                  padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Notifications</span>
                  <span style={{
                    padding: '2px 8px', fontSize: 12, background: 'rgba(239,68,68,0.15)',
                    color: '#ef4444', borderRadius: 10, fontWeight: 600,
                  }}>{unread.length} new</span>
                </div>
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} style={{
                      padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)',
                      background: alert.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.03)',
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className={`severity-${alert.severity.toLowerCase()}`} style={{
                          padding: '2px 8px', borderRadius: 6, fontSize: 10,
                          fontWeight: 700, textTransform: 'uppercase',
                        }}>
                          {alert.severity}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{alert.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {alert.message.slice(0, 80)}...
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>
          SC
        </div>
      </div>
    </header>
  )
}
