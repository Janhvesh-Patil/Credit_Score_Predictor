import { useNavigate } from 'react-router-dom'
import { FileText, Zap, ShieldCheck, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#070b16', color: '#f1f5f9', fontFamily: 'Inter, Segoe UI, system-ui, sans-serif' }}>

      {/* ═══ NAVBAR ═══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(7,11,22,0.9)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#3b82f6,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(59,130,246,0.3)' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>IC</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#fff', cursor: 'pointer', letterSpacing: '-0.02em' }} onClick={() => window.scrollTo(0, 0)}>Intelli-Credit</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ display: 'flex', gap: 24 }}>
              <a href="#features" style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Features</a>
              <a href="#how-it-works" style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>How it Works</a>
            </div>
            <button
              onClick={() => navigate('/app')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 999, background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
            >
              Launch App <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero-bg" style={{ paddingTop: 160, paddingBottom: 100, position: 'relative', overflow: 'visible' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 28 }}>
            Vivriti Capital · AI/ML Hackathon 2026
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 8vw, 88px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#fff', marginBottom: 24 }}>
            Next-Generation<br />
            <span style={{ background: 'linear-gradient(90deg,#60a5fa,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Credit Intelligence
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#94a3b8', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 400 }}>
            AI-powered appraisal engine delivering faster decisions, explainable risk models, and automated document analysis for modern financial institutions.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/app')}
              className="cta-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 16, padding: '14px 36px' }}
            >
              <Zap size={18} /> Start Analysis
            </button>
            <a
              href="#how-it-works"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 16, padding: '14px 36px', borderRadius: 10, fontWeight: 600, color: '#cbd5e1', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(100,116,139,0.3)', textDecoration: 'none', cursor: 'pointer' }}
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={{ background: '#070b16', padding: '96px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', marginBottom: 16 }}>Enterprise-Grade Capabilities</h2>
            <p style={{ color: '#94a3b8', maxWidth: 520, margin: '0 auto', fontSize: 17, lineHeight: 1.7 }}>
              Purpose-built for financial analysts to streamline credit assessments with state-of-the-art machine learning.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                icon: <ShieldCheck size={28} color="#60a5fa" />,
                color: '#3b82f6', title: 'Explainable AI',
                desc: 'Move beyond black-box models. Our SHAP-integrated engine explains exactly which financial factors influenced the credit decision.'
              },
              {
                icon: <FileText size={28} color="#22d3ee" />,
                color: '#22d3ee', title: 'Document Analysis',
                desc: 'Automated extraction from balance sheets and income statements using advanced proprietary OCR and NLP models.'
              },
              {
                icon: <BarChart3 size={28} color="#c084fc" />,
                color: '#c084fc', title: 'Real-time Metrics',
                desc: 'Instantly compute robust financial ratios, default probabilities, and industry-calibrated risk benchmarks.'
              },
            ].map((card) => (
              <div key={card.title} style={{
                background: 'rgba(17,28,50,0.5)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20, padding: '32px 28px', backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4)` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: 54, height: 54, borderRadius: 14, background: `${card.color}18`, border: `1px solid ${card.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>{card.title}</h3>
                <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" style={{ background: '#0a0f1e', borderTop: '1px solid rgba(30,48,84,0.6)', borderBottom: '1px solid rgba(30,48,84,0.6)', padding: '96px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', marginBottom: 16 }}>How Intelli-Credit Works</h2>
            <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>An intuitive, automated workflow designed for speed and human-verifiable accuracy.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, position: 'relative' }}>
            {[
              { id: '01', title: 'Upload Data', desc: 'Securely upload corporate financials or manually input statement metrics.', color: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
              { id: '02', title: 'AI Processing', desc: 'Our engine parses financials and evaluates industry context in real-time.', color: '#22d3ee', border: 'rgba(34,211,238,0.3)' },
              { id: '03', title: 'Expert Decisions', desc: 'Get final risk scores with comprehensive, human-readable explanations.', color: '#c084fc', border: 'rgba(192,132,252,0.3)' },
            ].map((step) => (
              <div key={step.id} style={{ textAlign: 'center' }}>
                <div style={{ width: 88, height: 88, borderRadius: 22, background: '#070b16', border: `2px solid ${step.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: step.color }}>{step.id}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, maxWidth: 260, margin: '0 auto' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ background: '#070b16', padding: '96px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ background: 'rgba(17,28,50,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 28, padding: '64px 48px', textAlign: 'center', backdropFilter: 'blur(10px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, background: 'rgba(59,130,246,0.06)', borderRadius: '50%', filter: 'blur(60px)' }} />
            <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, background: 'rgba(192,132,252,0.06)', borderRadius: '50%', filter: 'blur(60px)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(32px,6vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#fff', marginBottom: 20 }}>
                Transform Your<br />Credit Process.
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.7, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
                Join forward-thinking financial institutions using Intelli-Credit to make faster, smarter decisions.
              </p>
              <button
                onClick={() => navigate('/app')}
                className="cta-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 16, padding: '14px 40px' }}
              >
                <Zap size={18} /> Launch Application
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ background: '#070b16', borderTop: '1px solid rgba(30,48,84,0.4)', padding: '56px 0 36px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>

            {/* Brand */}
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>IC</span>
                </div>
                <span style={{ fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: '-0.02em' }}>Intelli-Credit</span>
              </div>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                Empowering financial institutions with verifiable, AI-driven credit intelligence systems.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[FileText, ShieldCheck].map((Icon, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(30,48,84,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Icon size={16} color="#475569" />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#475569', marginBottom: 18 }}>Navigation</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li><a href="#features" style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Key Features</a></li>
                <li><a href="#how-it-works" style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>How it works</a></li>
                <li><span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/app')}>Analysis Engine</span></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#475569', marginBottom: 18 }}>Resources</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li><span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Documentation</span></li>
                <li><span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>API Reference</span></li>
              </ul>
            </div>

            {/* Hackathon */}
            <div>
              <h4 style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#475569', marginBottom: 18 }}>Hackathon</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>
                  <CheckCircle2 size={15} color="#22c55e" /> Vivriti Capital
                </li>
                <li style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>National AI/ML</li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(30,48,84,0.4)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#475569', fontSize: 13 }}>© {new Date().getFullYear()} Intelli-Credit. All rights reserved.</span>
            <span style={{ color: '#334155', background: 'rgba(15,23,42,0.6)', padding: '6px 16px', borderRadius: 20, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid rgba(30,48,84,0.6)' }}>
              Built for National AI/ML Hackathon 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
