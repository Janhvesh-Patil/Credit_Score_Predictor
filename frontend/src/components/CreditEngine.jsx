import { useState, useRef } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList
} from 'recharts'
import { Zap, AlertTriangle, TrendingUp, Info } from 'lucide-react'

const API_BASE = 'http://localhost:5000'

// ── Field Definitions ─────────────────────────────────────────────────────────
const CARD_FIELDS = [
  {
    title: 'Company Financials',
    icon: '📊',
    fields: [
      { key: 'Total_Assets',         label: 'Total Assets',         unit: '₹', type: 'number' },
      { key: 'Total_Liabilities',    label: 'Total Liabilities',    unit: '₹', type: 'number' },
      { key: 'Current_Assets',       label: 'Current Assets',       unit: '₹', type: 'number' },
      { key: 'Current_Liabilities',  label: 'Current Liabilities',  unit: '₹', type: 'number' },
      { key: 'Revenue',              label: 'Revenue',              unit: '₹', type: 'number' },
      { key: 'Net_Income',           label: 'Net Income',           unit: '₹', type: 'number', allowNeg: true },
    ],
  },
  {
    title: 'Profitability & Risk Ratios',
    icon: '📈',
    fields: [
      { key: 'Operating_Income',      label: 'Operating Income',      type: 'number' },
      { key: 'Cash_Flow',             label: 'Cash Flow',             type: 'number', allowNeg: true },
      { key: 'Debt_Equity_Ratio',     label: 'Debt Equity Ratio',     type: 'number', step: '0.01' },
      { key: 'Return_on_Assets',      label: 'Return on Assets',      type: 'number', step: '0.01', allowNeg: true },
      { key: 'Working_Capital_Ratio', label: 'Working Capital Ratio', type: 'number', step: '0.01' },
    ],
  },
  {
    title: 'Market Conditions',
    icon: '🌐',
    fields: [
      { key: 'Stock_Price_Close', label: 'Stock Price Close',  type: 'number' },
      { key: 'Volatility_Index',  label: 'Volatility Index',   type: 'number', min: 10, max: 60 },
      { key: 'GDP_Growth_Rate',   label: 'GDP Growth Rate',    type: 'number', step: '0.01', allowNeg: true },
      { key: 'Interest_Rate',     label: 'Interest Rate',      type: 'number', step: '0.01', unit: '%' },
      { key: 'Inflation_Rate',    label: 'Inflation Rate',     type: 'number', step: '0.01', unit: '%' },
    ],
  },
]

const INDUSTRY_OPTIONS = [
  'Energy', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Technology'
]

const INDUSTRY_ONE_HOT = [
  'Industry_Sector_Finance',
  'Industry_Sector_Healthcare',
  'Industry_Sector_Manufacturing',
  'Industry_Sector_Retail',
  'Industry_Sector_Technology',
]

const INITIAL_FORM = {
  Total_Assets: '', Total_Liabilities: '', Current_Assets: '', Current_Liabilities: '',
  Revenue: '', Net_Income: '', Operating_Income: '', Cash_Flow: '',
  Debt_Equity_Ratio: '', Return_on_Assets: '', Working_Capital_Ratio: '',
  Stock_Price_Close: '', Volatility_Index: '', GDP_Growth_Rate: '',
  Interest_Rate: '', Inflation_Rate: '',
}

// ── Pretty-print feature names ────────────────────────────────────────────────
function prettyName(name) {
  return name
    .replace(/Industry_Sector_/g, '')
    .replace(/_/g, ' ')
}

// ── Custom Tooltip for SHAP chart ─────────────────────────────────────────────
function ShapTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#1a2744', border: '1px solid #2d4a7a', borderRadius: 8,
      padding: '10px 14px', fontSize: 13, color: '#e2e8f0', lineHeight: 1.6,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{prettyName(d.feature)}</div>
      <div>SHAP Value: <span style={{ color: d.shap_value > 0 ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
        {d.shap_value > 0 ? '+' : ''}{d.shap_value.toFixed(4)}
      </span></div>
      <div>Impact: <span style={{ fontWeight: 500 }}>{d.impact_label}</span></div>
      <div>Direction: {d.direction}</div>
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

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const buildPayload = () => {
    const payload = {}
    for (const key of Object.keys(INITIAL_FORM)) {
      payload[key] = form[key] === '' ? 0 : parseFloat(form[key])
    }
    for (const col of INDUSTRY_ONE_HOT) {
      payload[col] = 0
    }
    if (industry !== 'Energy') {
      payload[`Industry_Sector_${industry}`] = 1
    }
    return payload
  }

  const handleSubmit = async () => {
    setError('')
    setResult(null)
    setLoading(true)

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

  return (
    <div className="animation-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <TrendingUp className="w-6 h-6 text-blue-500" /> Credit Decision Engine
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Enter the company's financial data below. Our AI will analyze the credit risk and explain its reasoning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {CARD_FIELDS.map((card, ci) => (
          <div key={ci} className="card">
            <h3 className="flex items-center gap-2 text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
              <span>{card.icon}</span> {card.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {card.fields.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                    {f.label} {f.unit && <span style={{ color: 'var(--text-muted)' }}>({f.unit})</span>}
                  </label>
                  <input
                    className="input-field"
                    type={f.type}
                    step={f.step || 'any'}
                    min={f.min}
                    max={f.max}
                    placeholder={f.allowNeg ? 'Can be negative' : '0'}
                    value={form[f.key]}
                    onChange={e => handleChange(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="card">
          <h3 className="flex items-center gap-2 text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
            <span>🏭</span> Industry Sector
          </h3>
          <div>
            <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              Select Industry
            </label>
            <select className="select-field" value={industry} onChange={e => setIndustry(e.target.value)}>
              {INDUSTRY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <p className="mt-3 text-xs flex items-start gap-2" style={{ color: 'var(--text-muted)' }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              Industry context helps calibrate risk assessment against sector benchmarks.
            </p>
          </div>
        </div>
      </div>

      <button className="cta-btn flex items-center justify-center gap-3" onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <>
            <span className="spinner"></span>
            Analyzing...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" /> Analyze Credit Risk
          </>
        )}
      </button>

      {error && (
        <div className="error-banner mt-6 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0 text-red-400 mt-0.5" />
          <div>
            <div className="font-semibold mb-1" style={{ color: '#fca5a5' }}>Analysis Failed</div>
            <div style={{ color: '#d4a5a5' }}>{error}</div>
          </div>
        </div>
      )}

      {result && (
        <div ref={resultRef} className="results-enter mt-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full" style={{ background: 'var(--accent-blue)' }}></div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Analysis Results</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 blur-[80px] rounded-full"></div>
              
              <div className="flex items-center gap-4 mb-8">
                <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-lg font-bold tracking-wide ${
                  result.label === 'HIGH RISK' ? 'badge-high' : 'badge-low'
                }`}>
                  {result.label === 'HIGH RISK' ? '🔴' : '🟢'} {result.label}
                </span>
              </div>

              <div className="mb-8">
                <h4 className="text-xs font-bold mb-4 tracking-wider text-slate-400">
                  CONFIDENCE SCORES
                </h4>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'var(--risk-green)' }}>Low Risk</span>
                    <span className="font-bold" style={{ color: 'var(--risk-green)' }}>{result.confidence.low_risk}%</span>
                  </div>
                  <div className="progress-track h-2">
                    <div className="progress-fill" style={{
                      width: `${result.confidence.low_risk}%`,
                      background: 'linear-gradient(90deg, #16a34a, #22c55e)',
                      boxShadow: '0 0 12px rgba(34,197,94,0.3)'
                    }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'var(--risk-red)' }}>High Risk</span>
                    <span className="font-bold" style={{ color: 'var(--risk-red)' }}>{result.confidence.high_risk}%</span>
                  </div>
                  <div className="progress-track h-2">
                    <div className="progress-fill" style={{
                      width: `${result.confidence.high_risk}%`,
                      background: 'linear-gradient(90deg, #dc2626, #ef4444)',
                      boxShadow: '0 0 12px rgba(239,68,68,0.3)'
                    }}></div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold mb-4 tracking-wider text-slate-400">
                  KEY RISK FLAGS
                </h4>
                <ul className="space-y-2.5">
                  {result.risk_factors.map((rf, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm py-2 px-3 rounded-lg border border-slate-700/50"
                      style={{ background: 'rgba(15,23,42,0.6)', color: 'var(--text-secondary)' }}>
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
                      {rf}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card">
              <h4 className="text-xs font-bold mb-1 tracking-wider text-slate-400">
                EXPLAINABLE AI
              </h4>
              <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Why did the model make this decision?
              </h3>

              <div style={{ width: '100%', height: shapData.length * 48 + 20 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shapData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e3054' }} tickLine={false} />
                    <YAxis type="category" dataKey="displayName" width={130}
                      tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ShapTooltip />} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
                    <Bar dataKey="absValue" radius={[0, 4, 4, 0]} barSize={20}>
                      {shapData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.shap_value > 0 ? '#ef4444' : '#22c55e'} fillOpacity={0.85} />
                      ))}
                      <LabelList
                        dataKey="impact_label"
                        position="right"
                        style={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center gap-6 mt-6 pt-5" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  <span className="w-3 h-3 rounded" style={{ background: '#ef4444' }}></span>
                  Increases Risk
                </div>
                <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  <span className="w-3 h-3 rounded" style={{ background: '#22c55e' }}></span>
                  Decreases Risk
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
