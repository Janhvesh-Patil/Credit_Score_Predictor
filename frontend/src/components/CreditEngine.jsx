import { useState, useRef } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList
} from 'recharts'
import { Zap, AlertTriangle, TrendingUp, Info, ShieldCheck, BarChart3, ChevronDown, ChevronUp } from 'lucide-react'

const API_BASE = 'http://localhost:5000'

const CARD_FIELDS = [
  {
    title: 'Company Financials', icon: '📊',
    accentColor: '#3b82f6',
    fields: [
      { key: 'Total_Assets',        label: 'Total Assets',        unit: '₹', type: 'number' },
      { key: 'Total_Liabilities',   label: 'Total Liabilities',   unit: '₹', type: 'number' },
      { key: 'Current_Assets',      label: 'Current Assets',      unit: '₹', type: 'number' },
      { key: 'Current_Liabilities', label: 'Current Liabilities', unit: '₹', type: 'number' },
      { key: 'Revenue',             label: 'Revenue',             unit: '₹', type: 'number' },
      { key: 'Net_Income',          label: 'Net Income',          unit: '₹', type: 'number', allowNeg: true },
    ],
  },
  {
    title: 'Profitability & Risk Ratios', icon: '📈',
    accentColor: '#22d3ee',
    fields: [
      { key: 'Operating_Income',      label: 'Operating Income',      type: 'number' },
      { key: 'Cash_Flow',             label: 'Cash Flow',             type: 'number', allowNeg: true },
      { key: 'Debt_Equity_Ratio',     label: 'Debt / Equity Ratio',   type: 'number', step: '0.01' },
      { key: 'Return_on_Assets',      label: 'Return on Assets',      type: 'number', step: '0.01', allowNeg: true },
      { key: 'Working_Capital_Ratio', label: 'Working Capital Ratio', type: 'number', step: '0.01' },
    ],
  },
  {
    title: 'Market Conditions', icon: '🌐',
    accentColor: '#c084fc',
    fields: [
      { key: 'Stock_Price_Close', label: 'Stock Price Close', type: 'number' },
      { key: 'Volatility_Index',  label: 'Volatility Index',  type: 'number', min: 10, max: 60 },
      { key: 'GDP_Growth_Rate',   label: 'GDP Growth Rate',   type: 'number', step: '0.01', allowNeg: true },
      { key: 'Interest_Rate',     label: 'Interest Rate',     type: 'number', step: '0.01', unit: '%' },
      { key: 'Inflation_Rate',    label: 'Inflation Rate',    type: 'number', step: '0.01', unit: '%' },
    ],
  },
]

const INDUSTRY_OPTIONS = ['Energy', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Technology']
const INDUSTRY_ONE_HOT = [
  'Industry_Sector_Finance', 'Industry_Sector_Healthcare',
  'Industry_Sector_Manufacturing', 'Industry_Sector_Retail', 'Industry_Sector_Technology',
]
const INITIAL_FORM = {
  Total_Assets: '', Total_Liabilities: '', Current_Assets: '', Current_Liabilities: '',
  Revenue: '', Net_Income: '', Operating_Income: '', Cash_Flow: '',
  Debt_Equity_Ratio: '', Return_on_Assets: '', Working_Capital_Ratio: '',
  Stock_Price_Close: '', Volatility_Index: '', GDP_Growth_Rate: '',
  Interest_Rate: '', Inflation_Rate: '',
}

function prettyName(name) {
  return name.replace(/Industry_Sector_/g, '').replace(/_/g, ' ')
}

function ShapTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{ background: '#111c32', border: '1px solid #1e3054', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e2e8f0', lineHeight: 1.7, boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: '#f1f5f9' }}>{prettyName(d.feature)}</div>
      <div>SHAP Value: <span style={{ color: d.shap_value > 0 ? '#ef4444' : '#22c55e', fontWeight: 700 }}>{d.shap_value > 0 ? '+' : ''}{d.shap_value.toFixed(4)}</span></div>
      <div style={{ color: '#94a3b8' }}>Impact: <span style={{ fontWeight: 500, color: '#e2e8f0' }}>{d.impact_label}</span></div>
      <div style={{ color: '#94a3b8' }}>Direction: {d.direction}</div>
    </div>
  )
}

function FieldGroup({ card, form, onChange }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ background: '#0d1425', border: `1px solid ${card.accentColor}22`, borderRadius: 14, padding: '20px 24px' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
          <span>{card.icon}</span> {card.title}
        </h3>
        {open ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
      </button>

      {open && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px 20px', marginTop: 18 }}>
          {card.fields.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {f.label} {f.unit && <span style={{ color: '#475569' }}>({f.unit})</span>}
              </label>
              <input
                className="input-field"
                type={f.type}
                step={f.step || 'any'}
                min={f.min}
                max={f.max}
                placeholder={f.allowNeg ? '0 (can be negative)' : '0'}
                value={form[f.key]}
                onChange={e => onChange(f.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CreditEngine() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [industry, setIndustry] = useState('Energy')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const resultRef = useRef(null)

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const buildPayload = () => {
    const payload = {}
    for (const key of Object.keys(INITIAL_FORM)) {
      payload[key] = form[key] === '' ? 0 : parseFloat(form[key])
    }
    for (const col of INDUSTRY_ONE_HOT) payload[col] = 0
    if (industry !== 'Energy') payload[`Industry_Sector_${industry}`] = 1
    return payload
  }

  const handleSubmit = async () => {
    setError(''); setResult(null); setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/predict_and_explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Server responded with ${res.status}`)
      }
      const data = await res.json()
      setResult(data)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      setError(err.message || 'Failed to connect to the API. Ensure the Flask server is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }

  const shapData = result?.explanation
    ? [...result.explanation]
        .sort((a, b) => Math.abs(a.shap_value) - Math.abs(b.shap_value))
        .map(d => ({ ...d, absValue: Math.abs(d.shap_value), displayName: prettyName(d.feature) }))
    : []

  /* ─── Shared card style ─── */
  const cardStyle = {
    background: '#0d1425',
    border: '1px solid #1e3054',
    borderRadius: 14,
    padding: '22px 24px',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Page Header ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={22} color="#60a5fa" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: '-0.02em' }}>Credit Decision Engine</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '3px 0 0', fontWeight: 500 }}>ML-powered risk analysis with explainable AI (SHAP)</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { label: 'XGBoost ML Model',    color: '#3b82f6' },
            { label: 'SHAP Explainability', color: '#c084fc' },
            { label: 'Real-time Analysis',  color: '#22d3ee' },
            { label: 'Industry Benchmarks', color: '#22c55e' },
          ].map(p => (
            <span key={p.label} style={{ padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, color: p.color, background: `${p.color}14`, border: `1px solid ${p.color}30` }}>
              {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { Icon: BarChart3,   label: 'Input Fields',   value: '17',       color: '#3b82f6' },
          { Icon: Zap,         label: 'Model',          value: 'XGBoost',  color: '#22d3ee' },
          { Icon: ShieldCheck, label: 'Explainability', value: 'SHAP',     color: '#c084fc' },
        ].map(({ Icon, label, value, color }) => (
          <div key={label} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}14`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>{label}</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: 0, whiteSpace: 'nowrap' }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Form Sections ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {CARD_FIELDS.map((card, ci) => (
          <FieldGroup key={ci} card={card} form={form} onChange={handleChange} />
        ))}

        {/* Industry Selector */}
        <div style={{ background: '#0d1425', border: '1px solid #f59e0b22', borderRadius: 14, padding: '20px 24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px' }}>
            🏭 Industry Sector
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Select Industry</label>
              <select className="select-field" value={industry} onChange={e => setIndustry(e.target.value)}>
                {INDUSTRY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <p style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: '22px 0 0' }}>
              <Info size={14} color="#475569" style={{ flexShrink: 0, marginTop: 2 }} />
              Industry context calibrates risk scores against sector-specific benchmarks.
            </p>
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      <div>
        <button
          className="cta-btn"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 15, padding: '14px 0' }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <><span className="spinner" /> Analyzing Credit Risk...</> : <><Zap size={18} /> Analyze Credit Risk</>}
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#334155', marginTop: 10 }}>
          Empty fields default to 0 — calculations run server-side on Flask + XGBoost.
        </p>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="error-banner" style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <AlertTriangle size={20} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontWeight: 700, color: '#fca5a5', fontSize: 14, marginBottom: 4 }}>Analysis Failed</div>
            <div style={{ color: 'rgba(252,165,165,0.8)', fontSize: 13 }}>{error}</div>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {result && (
        <div ref={resultRef} className="results-enter">
          {/* Results Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 5, height: 32, borderRadius: 99, background: 'linear-gradient(180deg,#60a5fa,#c084fc)', flexShrink: 0 }} />
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Analysis Results</h2>
            <span style={{
              padding: '5px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700,
              ...(result.label === 'HIGH RISK'
                ? { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }
                : { background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' })
            }}>
              {result.label === 'HIGH RISK' ? '🔴' : '🟢'} {result.label}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>

            {/* Risk Panel */}
            <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, background: 'rgba(59,130,246,0.04)', filter: 'blur(60px)', borderRadius: '50%', pointerEvents: 'none' }} />

              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', color: '#475569', textTransform: 'uppercase', margin: '0 0 18px' }}>Confidence Scores</p>

              {[
                { label: 'Low Risk', value: result.confidence.low_risk, color: '#22c55e', gradient: 'linear-gradient(90deg,#16a34a,#22c55e)' },
                { label: 'High Risk', value: result.confidence.high_risk, color: '#ef4444', gradient: 'linear-gradient(90deg,#dc2626,#ef4444)' },
              ].map(bar => (
                <div key={bar.label} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: bar.color }}>{bar.label}</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: bar.color }}>{bar.value}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${bar.value}%`, height: '100%', borderRadius: 6, background: bar.gradient, boxShadow: `0 0 12px ${bar.color}55`, transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)' }} />
                  </div>
                </div>
              ))}

              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', color: '#475569', textTransform: 'uppercase', margin: '20px 0 12px' }}>Key Risk Flags</p>
              {result.risk_factors.length === 0 ? (
                <p style={{ fontSize: 14, color: '#4ade80', textAlign: 'center', padding: '16px 0', opacity: 0.8 }}>✅ No significant risk flags detected.</p>
              ) : (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {result.risk_factors.map((rf, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, padding: '10px 12px', borderRadius: 10, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(30,48,84,0.6)', color: '#94a3b8', lineHeight: 1.5 }}>
                      <AlertTriangle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
                      {rf}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* SHAP Chart */}
            <div style={cardStyle}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', color: '#475569', textTransform: 'uppercase', margin: '0 0 4px' }}>Explainable AI</p>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 18px' }}>Why did the model decide this?</h3>

              <div style={{ width: '100%', height: Math.max(shapData.length * 46 + 20, 200) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shapData} layout="vertical" margin={{ top: 0, right: 56, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e3054' }} tickLine={false} />
                    <YAxis type="category" dataKey="displayName" width={120} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ShapTooltip />} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
                    <Bar dataKey="absValue" radius={[0, 5, 5, 0]} barSize={16}>
                      {shapData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.shap_value > 0 ? '#ef4444' : '#22c55e'} fillOpacity={0.85} />
                      ))}
                      <LabelList dataKey="impact_label" position="right" style={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(30,48,84,0.6)' }}>
                {[
                  { color: '#ef4444', label: 'Increases Risk' },
                  { color: '#22c55e', label: 'Decreases Risk' },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: l.color, flexShrink: 0 }} />
                    {l.label}
                  </div>
                ))}
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#334155', fontFamily: 'monospace' }}>SHAP · XGBoost</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
