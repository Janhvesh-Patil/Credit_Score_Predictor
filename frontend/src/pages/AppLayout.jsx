import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { FileText, Activity, LogOut, Cpu, Newspaper } from 'lucide-react'

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const isDocAnalyzer = location.pathname === '/app/document'
  const isCreditEngine = location.pathname === '/app' || location.pathname === '/app/'
  const isCompanyRisk = location.pathname === '/app/company-risk'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#070b16', color: '#f1f5f9', fontFamily: 'Inter, Segoe UI, system-ui, sans-serif' }}>

      {/* ═══ HEADER ═══ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(7,11,22,0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(30,48,84,0.5)',
        height: 56,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,rgba(59,130,246,0.25),rgba(34,211,238,0.25))', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#60a5fa', fontWeight: 900, fontSize: 12 }}>IC</span>
          </div>
          <span style={{ fontWeight: 700, color: '#fff', fontSize: 14, letterSpacing: '-0.01em' }}>Intelli-Credit</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#475569', border: '1px solid rgba(30,48,84,0.6)', background: 'rgba(15,23,42,0.4)', textTransform: 'uppercase' }}>
          <Cpu size={12} /> AI Analysis Suite
        </div>

        <button
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 12px', borderRadius: 8 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.6)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}
        >
          <LogOut size={15} />
          <span style={{ fontWeight: 500 }}>Exit App</span>
        </button>
      </header>

      {/* ═══ TAB NAVIGATION ═══ */}
      <nav style={{
        position: 'sticky', top: 56, zIndex: 40,
        background: 'rgba(7,11,22,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(30,48,84,0.5)',
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 16px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { label: 'Document Analyzer', shortLabel: 'Docs', icon: FileText, active: isDocAnalyzer, path: '/app/document' },
            { label: 'Credit Decision Engine', shortLabel: 'Credit', icon: Activity, active: isCreditEngine, path: '/app' },
            { label: 'Company Risk Analyzer', shortLabel: 'Risk', icon: Newspaper, active: isCompanyRisk, path: '/app/company-risk' },
          ].map((tab) => (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 18px', borderRadius: 10,
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
                background: tab.active ? 'rgba(59,130,246,0.12)' : 'transparent',
                color: tab.active ? '#60a5fa' : '#64748b',
                border: tab.active ? '1px solid rgba(59,130,246,0.25)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              <tab.icon size={15} color={tab.active ? '#60a5fa' : '#64748b'} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ═══ PAGE CONTENT ═══ */}
      <main style={{ flex: 1, width: '100%', maxWidth: 1100, margin: '0 auto', padding: '36px 24px 48px', boxSizing: 'border-box' }}>
        <Outlet />
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: '1px solid rgba(30,48,84,0.4)', background: '#070b16', padding: '14px 24px', flexShrink: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#334155', fontWeight: 500 }}>
            © {new Date().getFullYear()} Intelli-Credit. All rights reserved.
          </span>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#334155' }}>
            Vivriti Capital · National AI/ML Hackathon 2026
          </span>
        </div>
      </footer>
    </div>
  )
}
