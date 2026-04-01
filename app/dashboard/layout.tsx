import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import AICopilot from '@/components/ui/AICopilot'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <TopBar />
        <main className="page-enter" style={{ flex: 1, padding: '28px 32px', overflowX: 'hidden' }}>
          {children}
        </main>
        <AICopilot />
      </div>
    </div>
  )
}
