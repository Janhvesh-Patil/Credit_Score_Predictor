import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AppLayout from './pages/AppLayout'
import DocumentAnalyzer from './components/DocumentAnalyzer'
import CreditEngine from './components/CreditEngine'
import './index.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<CreditEngine />} />
          <Route path="document" element={<DocumentAnalyzer />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
