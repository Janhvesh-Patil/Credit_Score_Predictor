import { useState } from 'react'
import { Building2, Search, AlertTriangle, ShieldAlert, BarChart3, RefreshCw, Zap, AlertCircle, CheckCircle2, Newspaper, Scale, Bug } from 'lucide-react'

const WEBHOOK_URL = 'https://yofepo9708.app.n8n.cloud/webhook-test/company-name'

const FEATURE_PILLS = [
  { label: 'Negative Signal Detection',    color: '#f87171' },
  { label: 'Fraud & Lawsuit Screening',    color: '#fbbf24' },
  { label: 'Regulatory Issue Tracking',    color: '#c084fc' },
  { label: 'News Risk Scoring (0-100)',    color: '#22d3ee' },
]

const ANALYSIS_STEPS = [
  { icon: Search,       label: 'Search',    desc: 'Crawl news sources',      color: '#60a5fa',  bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)' },
  { icon: AlertTriangle,label: 'Detect',    desc: 'Flag negative signals',   color: '#fbbf24',  bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
  { icon: ShieldAlert,  label: 'Assess',    desc: 'Evaluate risk factors',   color: '#f87171',  bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
  { icon: BarChart3,    label: 'Score',     desc: 'Compute risk score',      color: '#4ade80',  bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
]

/* ── Parses the n8n response and renders structured sections ── */
function RiskResultDisplay({ result }) {

  /* Step 1: Extract and clean the JSON payload from the n8n wrapper.
     n8n returns: [ { "output": "```json\n{...}\n```" } ]
     We unwrap the array, grab the `output` string, strip the markdown
     code fence (``` json ... ```), then JSON.parse the inner payload. */
  function extractPayload(val) {
    // Unwrap arrays recursively
    let v = val
    while (Array.isArray(v) && v.length > 0) v = v[0]

    // If it's an object with an "output" key that is a string → extract it
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const outputKey = Object.keys(v).find(k => k.toLowerCase() === 'output')
      if (outputKey && typeof v[outputKey] === 'string') {
        // Strip markdown code fences: ```json ... ``` or ``` ... ```
        const stripped = v[outputKey]
          .replace(/^```[\w]*\n?/m, '')
          .replace(/\n?```\s*$/m, '')
          .trim()
        try { return JSON.parse(stripped) } catch { /* fall through */ }
      }
      return v  // plain object, use as-is
    }

    // If already a string, try JSON.parse
    if (typeof v === 'string') {
      const stripped = v.replace(/^```[\w]*\n?/m, '').replace(/\n?```\s*$/m, '').trim()
      try { return JSON.parse(stripped) } catch { return v }
    }
    return v
  }

  const payload = extractPayload(result)

  /* Step 2: Case-insensitive key lookup (handles underscores/spaces) */
  function pick(obj, keys) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return undefined
    const norm = k => k.toLowerCase().replace(/[\s_-]/g, '')
    for (const [k, v] of Object.entries(obj)) {
      if (keys.includes(norm(k))) return v
    }
    return undefined
  }

  /* Step 3: Pull top-level fields, then also check inside risk_flags nesting */
  const riskFlags = pick(payload, ['riskflags', 'risk_flags', 'flags', 'risks'])

  const newsRiskScore   = pick(payload, ['newsriskscore', 'riskscore', 'score', 'news_risk_score', 'risk_score', 'riskrating'])
                       ?? pick(riskFlags, ['newsriskscore', 'riskscore', 'score', 'news_risk_score', 'risk_score'])

  const negativeSignals = pick(payload, ['negativesignals', 'negative_signals', 'signals', 'negatives', 'warnings'])
                       ?? pick(riskFlags, ['negativesignals', 'negative_signals', 'signals', 'negatives', 'warnings'])

  const fraudIssues     = pick(payload, ['fraudlawsuitsregulatoryissues', 'fraud', 'lawsuits', 'regulatoryissues', 'issues', 'legalissues'])
                       ?? pick(riskFlags, ['fraudlawsuitsregulatoryissues', 'fraud', 'lawsuits', 'regulatoryissues', 'issues', 'legalissues'])

  const analysisNotes   = pick(payload, ['analysisnotes', 'analysis_notes', 'notes', 'summary', 'explanation', 'analysis', 'overview', 'detail'])
                       ?? pick(riskFlags, ['analysisnotes', 'analysis_notes', 'notes', 'summary', 'explanation', 'analysis'])

  const hasStructured = newsRiskScore !== undefined || negativeSignals !== undefined || fraudIssues !== undefined

  const secStyle = { background: '#0d1425', border: '1px solid #1e3054', borderRadius: 12, padding: '18px 22px' }
  const lblStyle = { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#475569', margin: '0 0 12px', display: 'block' }

  /* Fallback: show raw JSON if nothing parsed */
  if (!hasStructured) {
    const text = typeof payload === 'object' ? JSON.stringify(payload, null, 2) : String(payload ?? '')
    return (
      <div style={{ background: '#070d1f', borderRadius: 12, border: '1px solid #1e3054', padding: '20px' }}>
        <pre style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{text}</pre>
      </div>
    )
  }

  /* Renders a plain list of strings */
  const renderStringList = (items, dotColor) => {
    const arr = Array.isArray(items)
      ? items
      : typeof items === 'string'
        ? items.split(/\n/).map(s => s.trim()).filter(Boolean)
        : [String(items)]
    if (arr.length === 0) return <p style={{ fontSize: 14, color: '#64748b', margin: 0, fontStyle: 'italic' }}>None detected</p>
    return (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {arr.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#cbd5e1', lineHeight: 1.75 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0, marginTop: 9 }} />
            {typeof item === 'object' ? JSON.stringify(item) : String(item)}
          </li>
        ))}
      </ul>
    )
  }

  /* Renders fraud issue cards: handles both [{type, details}] and plain strings */
  const renderFraudIssues = (items) => {
    const arr = Array.isArray(items) ? items : [items]
    const isTyped = arr.length > 0 && arr[0] && typeof arr[0] === 'object' && ('type' in arr[0] || 'details' in arr[0])

    if (!isTyped) return renderStringList(items, '#fbbf24')

    const typeColors = {
      'lawsuits': '#c084fc',
      'regulatory': '#22d3ee',
      'fraud': '#f87171',
      'antitrust': '#fb923c',
      'securities': '#fbbf24',
      'privacy': '#60a5fa',
    }
    const getColor = (type = '') => {
      const t = type.toLowerCase()
      for (const [key, color] of Object.entries(typeColors)) {
        if (t.includes(key)) return color
      }
      return '#94a3b8'
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {arr.map((issue, i) => {
          const type    = issue.type    ?? issue.category ?? issue.kind ?? ''
          const details = issue.details ?? issue.description ?? issue.info ?? ''
          const color   = getColor(type)
          return (
            <div key={i} style={{ borderRadius: 10, border: `1px solid ${color}28`, background: `${color}0a`, padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: '0.05em' }}>{type}</span>
              </div>
              {details && (
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: 0, paddingLeft: 16 }}>{String(details)}</p>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="animation-fade-in">

      {/* ── News Risk Score ── */}
      {newsRiskScore !== undefined && (() => {
        const num = Number(newsRiskScore)
        const isNum = !isNaN(num)
        const barColor = num >= 70 ? '#ef4444' : num >= 40 ? '#f59e0b' : '#22c55e'
        const pct = Math.min(100, Math.max(0, num))
        const riskLabel = num >= 70 ? 'HIGH RISK' : num >= 40 ? 'MEDIUM RISK' : 'LOW RISK'
        const riskLabelColor = num >= 70 ? '#ef4444' : num >= 40 ? '#f59e0b' : '#22c55e'
        const riskBg     = num >= 70 ? 'rgba(239,68,68,0.08)'   : num >= 40 ? 'rgba(245,158,11,0.08)'  : 'rgba(34,197,94,0.08)'
        const riskBorder = num >= 70 ? 'rgba(239,68,68,0.28)'   : num >= 40 ? 'rgba(245,158,11,0.28)'  : 'rgba(34,197,94,0.28)'
        return (
          <div style={{ ...secStyle, border: `1px solid ${riskBorder}`, background: riskBg }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={lblStyle}>📊 News Risk Score</span>
              {isNum && (
                <span style={{ fontSize: 11, fontWeight: 800, color: riskLabelColor, letterSpacing: '0.1em', padding: '3px 10px', borderRadius: 999, background: `${riskLabelColor}18`, border: `1px solid ${riskLabelColor}30` }}>
                  {riskLabel}
                </span>
              )}
            </div>
            <p style={{ fontSize: 40, fontWeight: 900, color: isNum ? riskLabelColor : '#f1f5f9', margin: isNum ? '0 0 16px' : 0, lineHeight: 1 }}>
              {String(newsRiskScore)}{isNum ? <span style={{ fontSize: 18, color: '#64748b', fontWeight: 500 }}> / 100</span> : ''}
            </p>
            {isNum && (
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', borderRadius: 6, background: barColor, boxShadow: `0 0 12px ${barColor}88`, transition: 'width 1.4s cubic-bezier(0.22,1,0.36,1)' }} />
              </div>
            )}
          </div>
        )
      })()}

      {/* ── Negative Signals ── */}
      {negativeSignals !== undefined && (
        <div style={{ ...secStyle, borderColor: 'rgba(248,113,113,0.25)', background: 'rgba(248,113,113,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <AlertTriangle size={15} color="#f87171" />
            <span style={{ ...lblStyle, margin: 0 }}>⚠️ Negative Signals</span>
          </div>
          {renderStringList(negativeSignals, '#f87171')}
        </div>
      )}

      {/* ── Fraud / Lawsuits / Regulatory Issues ── */}
      {fraudIssues !== undefined && (
        <div style={{ ...secStyle, borderColor: 'rgba(251,191,36,0.25)', background: 'rgba(251,191,36,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <ShieldAlert size={15} color="#fbbf24" />
            <span style={{ ...lblStyle, margin: 0 }}>🔍 Fraud, Lawsuits & Regulatory Issues</span>
          </div>
          {renderFraudIssues(fraudIssues)}
        </div>
      )}

      {/* ── Analysis Notes ── */}
      {analysisNotes !== undefined && (
        <div style={{ ...secStyle, borderColor: 'rgba(96,165,250,0.2)', background: 'rgba(59,130,246,0.03)' }}>
          <span style={lblStyle}>💡 Analysis Notes</span>
          {Array.isArray(analysisNotes)
            ? renderStringList(analysisNotes, '#60a5fa')
            : <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{String(analysisNotes)}</p>
          }
        </div>
      )}

      {/* ── Raw JSON (collapsible) ── */}
      <details style={{ ...secStyle, cursor: 'pointer' }}>
        <summary style={{ fontSize: 12, fontWeight: 600, color: '#64748b', outline: 'none', userSelect: 'none' }}>View Raw JSON Response</summary>
        <pre style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: '14px 0 0', background: '#070d1f', borderRadius: 8, padding: 14 }}>
          {typeof payload === 'object' ? JSON.stringify(payload, null, 2) : String(payload)}
        </pre>
      </details>
    </div>
  )
}


export default function CompanyRiskAnalyzer() {
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!companyName.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName.trim() }),
      })
      if (!response.ok) throw new Error(`Request failed with status: ${response.status}`)
      const contentType = response.headers.get('content-type')
      const data = contentType?.includes('application/json') ? await response.json() : await response.text()
      setResult(data)
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the company.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => { setCompanyName(''); setResult(null); setError(null) }
  const handleKeyDown = (e) => { if (e.key === 'Enter' && companyName.trim() && !loading) handleAnalyze() }

  const cardStyle = { background: '#0d1425', border: '1px solid #1e3054', borderRadius: 14, padding: '20px 22px' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Page Header ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Newspaper size={22} color="#f87171" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: '-0.02em' }}>Company Risk Analyzer</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '3px 0 0', fontWeight: 500 }}>AI-powered news risk intelligence & fraud detection</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {FEATURE_PILLS.map(pill => (
            <span key={pill.label} style={{ padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, color: pill.color, background: `${pill.color}14`, border: `1px solid ${pill.color}30` }}>
              {pill.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Process Steps ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {ANALYSIS_STEPS.map((step, i) => {
          const Icon = step.icon
          const isActive = loading && i <= 2
          const isDone = result && i <= 3
          return (
            <div key={i} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, padding: '18px 12px', ...(isDone ? { borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.04)' } : {}) }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: step.bg, border: `1px solid ${step.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: loading && i === 2 ? 'pulse 1.5s infinite' : 'none' }}>
                {isDone && i === 3
                  ? <CheckCircle2 size={18} color="#4ade80" />
                  : <Icon size={18} color={step.color} />
                }
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{step.label}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{step.desc}</div>
              </div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: isDone ? '#4ade80' : isActive ? '#fbbf24' : '#1e3054', boxShadow: isDone ? '0 0 8px #4ade8066' : isActive ? '0 0 8px #fbbf2466' : 'none' }} />
            </div>
          )
        })}
      </div>

      {/* ── Main Content: Input + Sidebar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

        {/* Input / Results Panel */}
        <div style={cardStyle}>
          {!result ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Building2 size={16} color="#f87171" />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Enter Company Name</h2>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 20px' }}>Enter a company name to scan for negative news, fraud, lawsuits, and regulatory issues.</p>

              {/* Input Field */}
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Search size={16} color="#475569" />
                </div>
                <input
                  id="company-name-input"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Adani Group, Reliance Industries, Infosys..."
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  style={{ paddingLeft: 42, fontSize: 15, height: 50, borderRadius: 12 }}
                />
              </div>

              {/* Error */}
              {error && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 13, marginBottom: 14 }}>
                  <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  id="analyze-btn"
                  className="cta-btn"
                  disabled={!companyName.trim() || loading}
                  onClick={handleAnalyze}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', fontSize: 14,
                    background: !companyName.trim() ? '#1e293b' : 'linear-gradient(135deg,#f87171,#dc2626)',
                    opacity: !companyName.trim() ? 0.5 : 1,
                  }}
                >
                  {loading ? <><span className="spinner" /> Analyzing...</> : <><Zap size={16} /> Analyze Risk</>}
                </button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="animation-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={18} color="#4ade80" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Analysis Complete</h3>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Risk assessment for "{companyName}"</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 10px', borderRadius: 8 }}
                >
                  <RefreshCw size={14} /> Analyze Another
                </button>
              </div>

              <RiskResultDisplay result={result} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* What We Detect */}
          <div style={{ ...cardStyle, borderColor: 'rgba(248,113,113,0.25)', background: 'rgba(248,113,113,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <ShieldAlert size={17} color="#f87171" />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>What We Detect</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Negative Press & Headlines',    color: '#f87171' },
                { label: 'Fraud Allegations',             color: '#fbbf24' },
                { label: 'Active / Past Lawsuits',        color: '#c084fc' },
                { label: 'Regulatory Violations',         color: '#22d3ee' },
                { label: 'ESG & Compliance Flags',        color: '#4ade80' },
                { label: 'Management Red Flags',          color: '#60a5fa' },
              ].map(item => (
                <li key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#94a3b8' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Score Guide */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: '0 0 14px' }}>Risk Score Guide</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { range: '0 – 30',  label: 'Low Risk',    color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
                { range: '31 – 69', label: 'Medium Risk',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
                { range: '70 – 100',label: 'High Risk',    color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
              ].map(tier => (
                <div key={tier.range} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: tier.bg }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: tier.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: tier.color, minWidth: 60 }}>{tier.range}</span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{tier.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
