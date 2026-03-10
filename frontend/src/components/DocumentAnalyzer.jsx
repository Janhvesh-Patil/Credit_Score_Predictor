import { useState } from 'react'
import { FileText, UploadCloud, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

const WEBHOOK_URL = 'https://yofepo9708.app.n8n.cloud/webhook-test/upload-doc'

export default function DocumentAnalyzer() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected && selected.type === 'application/pdf') {
      setFile(selected)
      setError(null)
      setResult(null)
    } else if (selected) {
      setError('Please select a valid PDF file.')
      setFile(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setError(null)
      setResult(null)
    } else if (droppedFile) {
      setError('Please drop a valid PDF file.')
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('data', file)

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`)
      }

      // Read response based on content type
      const contentType = response.headers.get("content-type")
      let data
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      setResult(data)
    } catch (err) {
      setError(err.message || 'An error occurred while uploading down Document.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="animation-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <FileText className="w-6 h-6 text-cyan-400" /> Document Analyzer
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Upload a financial PDF document to securely extract insights via our AI pipeline (n8n Webhook).
        </p>
      </div>

      <div className="card mb-8">
        {!result ? (
          <>
            <div 
              className={`dropzone relative flex flex-col items-center justify-center p-12 mt-4 border-2 border-dashed rounded-xl transition-all duration-300 ${
                isDragging ? 'border-cyan-400 bg-cyan-900/10' : 'border-slate-700 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
                disabled={loading}
              />
              
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 text-slate-400 shadow-xl group-hover:scale-110 transition-transform">
                <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-cyan-400' : ''}`} />
              </div>
              
              <h3 className="text-lg font-semibold text-slate-200 mb-2">
                {file ? file.name : 'Drag & drop your PDF here'}
              </h3>
              
              <p className="text-sm text-slate-400 mb-6">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'or click to browse from your computer'}
              </p>
              
              {file && !loading && (
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFile(null); setError(null); }}
                  className="z-20 text-xs px-3 py-1.5 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors absolute bottom-6"
                >
                  Remove File
                </button>
              )}
            </div>

            {error && (
              <div className="mt-6 flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button 
                className="cta-btn flex items-center justify-center gap-2 max-w-[240px]" 
                disabled={!file || loading}
                onClick={handleUpload}
                style={{ background: !file ? 'var(--bg-secondary)' : 'linear-gradient(135deg, var(--accent-cyan), #0891b2)' }}
              >
                {loading ? (
                  <><span className="spinner border-t-white"></span> Extracting...</>
                ) : (
                  <>Extract Insights</>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="animation-fade-in relative z-20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-200">Processing Complete</h3>
                  <p className="text-sm text-slate-400">Response from n8n webhook</p>
                </div>
              </div>
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Upload Another
              </button>
            </div>

            <div className="bg-[#0b101d] rounded-xl border border-slate-800/80 p-6 overflow-x-auto shadow-inner relative">
              <div className="absolute top-0 right-0 px-3 py-1 bg-slate-800 text-xs font-mono text-slate-400 rounded-bl-lg border-b border-l border-slate-700">
                 Output Payload
              </div>
              <pre className="text-sm font-mono text-slate-300 mt-2 whitespace-pre-wrap word-break-all">
                {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
