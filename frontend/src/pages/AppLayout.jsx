import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { FileText, Activity, LogOut } from 'lucide-react'

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // To keep the layout simple, we use the URL path to determine the active tab
  const isDocAnalyzer = location.pathname === '/app/document'
  const isCreditEngine = location.pathname === '/app' || location.pathname === '/app/'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* ═══ MINIMAL HEADER ═══ */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#0a0f1e] border-b border-slate-800/80 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <span className="text-blue-500 font-bold text-sm">IC</span>
          </div>
          <span className="font-bold tracking-wide text-white">Intelli-Credit</span>
        </Link>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Exit App</span>
        </button>
      </header>

      {/* ═══ TAB NAVIGATION ═══ */}
      <nav className="flex justify-center bg-[#070b16]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-[65px] z-40">
        <button 
          className={`tab-btn flex items-center gap-2 ${isDocAnalyzer ? 'active' : ''}`} 
          onClick={() => navigate('/app/document')}
        >
          <FileText className={`w-4 h-4 ${isDocAnalyzer ? 'text-blue-400' : 'text-slate-500'}`} /> 
          Document Analyzer
        </button>
        <button 
          className={`tab-btn flex items-center gap-2 ${isCreditEngine ? 'active' : ''}`} 
          onClick={() => navigate('/app')}
        >
          <Activity className={`w-4 h-4 ${isCreditEngine ? 'text-blue-400' : 'text-slate-500'}`} /> 
          Credit Decision Engine
        </button>
      </nav>

      {/* ═══ PAGE CONTENT ═══ */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 relative">
        <Outlet />
      </main>
      
      {/* ═══ FOOTER ═══ */}
      <footer className="text-center py-6 text-xs tracking-wide border-t border-slate-800/60 text-slate-500 bg-[#0a0f1e]">
        Intelli-Credit — Built for Vivriti Capital National AI/ML Hackathon 2026
      </footer>
    </div>
  )
}
