import { useState } from 'react'
import { FileText, UploadCloud, CheckCircle2, AlertCircle, RefreshCw, Cpu, Zap, ShieldCheck, Search, FileCheck } from 'lucide-react'

const WEBHOOK_URL = 'https://yofepo9708.app.n8n.cloud/webhook-test/upload-doc'

const PROCESS_STEPS = [
  { icon: UploadCloud, label: 'Upload',  desc: 'PDF uploaded securely',  color: '#60a5fa',  bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)'  },
  { icon: Cpu,         label: 'Parse',   desc: 'OCR & NLP extraction',   color: '#22d3ee',  bg: 'rgba(34,211,238,0.1)',  border: 'rgba(34,211,238,0.25)'  },
  { icon: Search,      label: 'Analyse', desc: 'AI risk evaluation',     color: '#c084fc',  bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.25)' },
  { icon: FileCheck,   label: 'Results', desc: 'Insight payload ready',  color: '#4ade80',  bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)'   },
]

const EXTRACT_ITEMS = [
  { label: 'Revenue & Net Income',       color: '#60a5fa'  },
  { label: 'Total Assets & Liabilities', color: '#22d3ee'  },
  { label: 'Debt / Equity Ratios',       color: '#c084fc'  },
  { label: 'Cash Flow Metrics',          color: '#4ade80'  },
  { label: 'Operational Margins',        color: '#fbbf24'  },
  { label: 'Working Capital Ratio',      color: '#f87171'  },
]

/* ── Parses n8n result and renders 3 clean sections ── */
function ResultDisplay({ result }) {
  // Recursively unwrap nested arrays: [[{...}]] → [{...}] → {...}
  function unwrap(val) {
    if (Array.isArray(val)) {
      if (val.length === 1) return unwrap(val[0])
      // If it's an array of objects, pick first
      const firstObj = val.find(v => v && typeof v === 'object' && !Array.isArray(v))
      if (firstObj) return firstObj
      return unwrap(val[0])
    }
    return val
  }

  // Normalise: if result is a string, try JSON-parsing first
  let raw = result
  if (typeof result === 'string') {
    try { raw = JSON.parse(result) } catch { /* keep as string */ }
  }

  const data = unwrap(raw)

  // Case-insensitive key lookup, ignoring underscores/spaces
  function pick(obj, keys) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return undefined
    const norm = k => k.toLowerCase().replace(/[\s_-]/g, '')
    for (const [k, v] of Object.entries(obj)) {
      if (keys.includes(norm(k))) return v
    }
    return undefined
  }

  const decision    = pick(data, ['decision', 'creditdecision', 'recommendation', 'outcome', 'verdict'])
  const riskScore   = pick(data, ['riskscore', 'score', 'creditrisk', 'rating', 'riskrating', 'probability'])
  const explanation = pick(data, ['explanation', 'reason', 'reasoning', 'rationale', 'summary', 'analysis', 'detail', 'details', 'notes'])

  const isStructured = decision !== undefined || riskScore !== undefined || explanation !== undefined

  // Colour-code decision card
  const isGreen  = typeof decision === 'string' && /approve|low|safe|accept|good|conditional/i.test(decision)
  const isRed    = typeof decision === 'string' && /reject|high|risk|deny|bad|decline/i.test(decision)
  const dColor   = isGreen ? '#4ade80' : isRed ? '#f87171' : '#60a5fa'
  const dBg      = isGreen ? 'rgba(34,197,94,0.08)'   : isRed ? 'rgba(239,68,68,0.08)'   : 'rgba(59,130,246,0.08)'
  const dBorder  = isGreen ? 'rgba(34,197,94,0.28)'   : isRed ? 'rgba(239,68,68,0.28)'   : 'rgba(59,130,246,0.28)'

  const secStyle = { background: '#0d1425', border: '1px solid #1e3054', borderRadius: 12, padding: '18px 22px' }
  const lblStyle = { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#475569', margin: '0 0 12px', display: 'block' }

  if (!isStructured) {
    // Fallback: readable plain text
    const text = typeof raw === 'object' ? JSON.stringify(raw, null, 2) : String(raw ?? '')
    return (
      <div style={{ background: '#070d1f', borderRadius: 12, border: '1px solid #1e3054', padding: '20px' }}>
        <pre style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{text}</pre>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Decision ── */}
      {decision !== undefined && (
        <div style={{ ...secStyle, border: `1px solid ${dBorder}`, background: dBg }}>
          <span style={lblStyle}>⚖️ Decision</span>
          <p style={{ fontSize: 24, fontWeight: 900, color: dColor, margin: 0, letterSpacing: '-0.02em' }}>
            {String(decision)}
          </p>
        </div>
      )}

      {/* ── Risk Score ── */}
      {riskScore !== undefined && (() => {
        const num = Number(riskScore)
        const isNum = !isNaN(num)
        const barColor = num >= 70 ? '#ef4444' : num >= 40 ? '#f59e0b' : '#22c55e'
        const pct = Math.min(100, Math.max(0, num))
        return (
          <div style={secStyle}>
            <span style={lblStyle}>📊 Risk Score</span>
            <p style={{ fontSize: 28, fontWeight: 900, color: '#f1f5f9', margin: isNum ? '0 0 14px' : 0 }}>
              {String(riskScore)}{isNum ? <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}> / 100</span> : ''}
            </p>
            {isNum && (
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', borderRadius: 6, background: barColor, boxShadow: `0 0 10px ${barColor}66`, transition: 'width 1.2s ease' }} />
              </div>
            )}
          </div>
        )
      })()}

      {/* ── Explanation ── */}
      {explanation !== undefined && (
        <div style={secStyle}>
          <span style={lblStyle}>💡 Explanation</span>
          {Array.isArray(explanation) ? (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {explanation.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#cbd5e1', lineHeight: 1.75 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: 8 }} />
                  {String(item)}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>
              {String(explanation)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function DocumentAnalyzer() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected && selected.type === 'application/pdf') {
      setFile(selected); setError(null); setResult(null)
    } else if (selected) {
      setError('Please select a valid PDF file.')
      setFile(null)
    }
  }

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile); setError(null); setResult(null)
    } else if (droppedFile) {
      setError('Please drop a valid PDF file.')
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true); setError(null); setResult(null)
    const formData = new FormData()
    formData.append('data', file)
    try {
      const response = await fetch(WEBHOOK_URL, { method: 'POST', body: formData })
      if (!response.ok) throw new Error(`Upload failed with status: ${response.status}`)
      const contentType = response.headers.get('content-type')
      const data = contentType?.includes('application/json') ? await response.json() : await response.text()
      setResult(data)
    } catch (err) {
      setError(err.message || 'An error occurred while uploading the document.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => { setFile(null); setResult(null); setError(null) }

  /* ── Shared styles ── */
  const cardStyle = { background: '#0d1425', border: '1px solid #1e3054', borderRadius: 14, padding: '20px 22px' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Page Header ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText size={22} color="#22d3ee" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: '-0.02em' }}>Document Analyzer</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '3px 0 0', fontWeight: 500 }}>AI-powered financial document intelligence</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { label: 'Balance Sheet Parsing',      color: '#60a5fa' },
            { label: 'Income Statement Analysis',  color: '#22d3ee' },
            { label: 'Financial Ratio Extraction', color: '#c084fc' },
          ].map(pill => (
            <span key={pill.label} style={{ padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, color: pill.color, background: `${pill.color}14`, border: `1px solid ${pill.color}30` }}>
              {pill.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Process Steps ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {PROCESS_STEPS.map((step, i) => {
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

      {/* ── Main content: Upload + Sidebar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

        {/* Upload Panel */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <UploadCloud size={16} color="#22d3ee" />
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Upload Financial Document</h2>
          </div>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Supports PDF balance sheets, income statements, and annual reports.</p>

          {!result ? (
            <>
              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minHeight: 200, borderRadius: 12, border: `2px dashed ${isDragging ? '#22d3ee' : file ? 'rgba(59,130,246,0.5)' : '#1e3054'}`,
                  background: isDragging ? 'rgba(34,211,238,0.05)' : file ? 'rgba(59,130,246,0.04)' : 'rgba(15,23,42,0.3)',
                  padding: 32, cursor: 'pointer', transition: 'all 0.25s', textAlign: 'center',
                }}
              >
                <input type="file" accept="application/pdf" onChange={handleFileChange} disabled={loading}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }} />

                <div style={{ width: 56, height: 56, borderRadius: 14, background: file ? 'rgba(59,130,246,0.12)' : 'rgba(30,48,84,0.6)', border: `1px solid ${file ? 'rgba(59,130,246,0.3)' : '#1e3054'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  {file ? <FileText size={26} color="#60a5fa" /> : <UploadCloud size={26} color={isDragging ? '#22d3ee' : '#475569'} />}
                </div>

                {file ? (
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#93c5fd', marginBottom: 4 }}>{file.name}</p>
                    <p style={{ fontSize: 13, color: '#64748b' }}>{(file.size / 1024 / 1024).toFixed(2)} MB · PDF</p>
                    {!loading && (
                      <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); setFile(null); setError(null) }}
                        style={{ position: 'relative', zIndex: 20, marginTop: 12, fontSize: 12, padding: '6px 16px', borderRadius: 8, background: '#1e293b', color: '#94a3b8', border: '1px solid #1e3054', cursor: 'pointer' }}
                      >
                        Remove File
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>Drag & drop your PDF here</h3>
                    <p style={{ fontSize: 13, color: '#64748b' }}>or click to browse from your computer</p>
                  </div>
                )}
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 13, marginTop: 14 }}>
                  <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
                <button
                  className="cta-btn"
                  disabled={!file || loading}
                  onClick={handleUpload}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', fontSize: 14,
                    background: !file ? '#1e293b' : 'linear-gradient(135deg,#22d3ee,#0891b2)',
                    opacity: !file ? 0.5 : 1,
                  }}
                >
                  {loading ? <><span className="spinner" /> Extracting Insights...</> : <><Zap size={16} /> Extract Insights</>}
                </button>
              </div>
            </>
          ) : (
            /* Results Output */
            <div className="animation-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={18} color="#4ade80" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Processing Complete</h3>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>AI analysis results from document</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 10px', borderRadius: 8 }}
                >
                  <RefreshCw size={14} /> Upload Another
                </button>
              </div>

              <ResultDisplay result={result} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Security */}
          <div style={{ ...cardStyle, borderColor: 'rgba(59,130,246,0.25)', background: 'rgba(59,130,246,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <ShieldCheck size={17} color="#60a5fa" />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Secure Processing</h3>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
              Documents are transmitted over encrypted channels and processed in-flight by our n8n AI pipeline — never stored on third-party servers.
            </p>
          </div>

          {/* What We Extract */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: '0 0 14px' }}>What We Extract</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {EXTRACT_ITEMS.map(item => (
                <li key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#94a3b8' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>


        </div>
      </div>
    </div>
  )
}
