import { useNavigate } from 'react-router-dom'
import { FileText, Zap, ShieldCheck } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* ═══ HERO SECTION ═══ */}
      <header className="hero-bg relative flex-1 flex flex-col justify-center items-center py-20 text-center">
        {/* Animated graph lines */}
        <div className="graph-lines">
          <div className="graph-line">
            <svg viewBox="0 0 1200 300" preserveAspectRatio="none">
              <path d="M0 250 Q100 200 200 220 T400 180 T600 200 T800 140 T1000 170 T1200 120" />
            </svg>
          </div>
          <div className="graph-line">
            <svg viewBox="0 0 1200 300" preserveAspectRatio="none">
              <path d="M0 200 Q150 180 300 160 T600 130 T900 170 T1200 100" />
            </svg>
          </div>
          <div className="graph-line">
            <svg viewBox="0 0 1200 300" preserveAspectRatio="none">
              <path d="M0 280 Q200 220 400 240 T800 160 T1200 190" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider mb-8"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--accent-blue)' }}>
            VIVRITI CAPITAL · AI/ML HACKATHON 2026
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span style={{ background: 'linear-gradient(135deg, #fff 40%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Intelli-Credit
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            AI-Powered Corporate Credit Appraisal —{' '}
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Faster Decisions</span>,{' '}
            <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Explainable Intelligence</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center text-base mb-14" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-3 bg-opacity-20 bg-blue-900/30 px-5 py-3 rounded-2xl border border-blue-500/10">
              <FileText className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
              <span className="text-sm">Analyzes financial statements & documents</span>
            </div>
            <div className="flex items-center gap-3 bg-opacity-20 bg-cyan-900/30 px-5 py-3 rounded-2xl border border-cyan-500/10">
              <ShieldCheck className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} />
              <span className="text-sm">Explains decisions with transparent AI</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/app')}
            className="cta-btn inline-flex items-center justify-center gap-3 text-lg px-10 py-5 mx-auto max-w-sm"
          >
            <Zap className="w-5 h-5" />
            Launch Application
          </button>
        </div>
      </header>

      {/* ═══ FOOTER ═══ */}
      <footer className="text-center py-8 text-sm tracking-wide"
        style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
        Intelli-Credit — Built for Vivriti Capital National AI/ML Hackathon 2026
      </footer>
    </div>
  )
}
