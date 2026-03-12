# Intelli-Credit — AI Corporate Credit Appraisal

Intelli-Credit is a modern, AI-powered web platform designed for corporate credit appraisal, financial document intelligence, and real-time market risk analysis. It streamlines the underwriting and due-diligence pipeline by connecting a premium front-end dashboard to automated AI webhooks.

## 🚀 What We Have Built

We built a comprehensive, responsive React application showcasing three core AI intelligence dashboards. Each dashboard is designed with a state-of-the-art "glassmorphic" dark theme highlighting data through animated charts, progress bars, and color-coded risk metrics.

### Key Features & Capabilities:

1. **Credit Decision Engine (`/app`)**
   - Central hub for automated credit scoring and risk tracking.
   - Visualizes overall credit limits, outstanding debts, and AI-driven verdict summaries.
   
2. **Document Analyzer (`/app/document`)**
   - Supports drag-and-drop secure PDF uploads for balance sheets, income statements, and annual reports.
   - Extracts revenue, liabilities, cash-flow metrics, and operational margins.
   - Communicates with an AI pipeline to return a Credit Decision (Approve/Reject), a numeric Risk Score, and detailed financial explanations.

3. **Company Risk Analyzer (`/app/company-risk`)** — *(Newly Added)*
   - Accepts a corporate entity's name (e.g., *Reliance, Infosys*) and conducts a web-crawling risk assessment.
   - **Detects Negative Signals**: Flags negative press and headlines.
   - **Fraud & Lawsuit Screening**: Highlights past/active lawsuits, regulatory violations, and ESG/compliance flags.
   - **News Risk Score (0-100)**: Calculates a real-time risk severity score with categorized visual indicators (Low/Medium/High Risk).
   - Provides the option to inspect the raw JSON output coming natively from the AI pipeline.

## ⚙️ How It Works

1. **User Interaction**: The user interacts with the sleek React interface to either upload a document or search for a company.
2. **Webhook Triggering**: The frontend securely packages the input (FormData for documents, JSON for company names) and sends an HTTP `POST` request to external **n8n Cloud Webhooks**.
3. **AI Pipeline Execution**: Our n8n backend processes the webhook, running the payload through LLMs, OCR parsers, or Web Search APIs.
4. **Data Aggregation and Display**: The backend responds with a JSON payload containing the analyzed intelligence. Our React app recursively unwraps and parses the JSON, rendering it into highly readable, color-coded dashboard widgets.

## 🛠 Tech Stack

**Frontend Architecture:**
- **Core**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) (Fast Hot Module Replacement)
- **Routing**: [React Router DOM v6](https://reactrouter.com/) (Nested routing via `<Outlet />` for unified layouts)
- **Styling**: Vanilla CSS with custom Global Variables (`index.css`)
  - Implements **Glassmorphism**, complex CSS radial-gradient animations, and dynamic pulse effects.
- **Icons**: [lucide-react](https://lucide.dev/) (Lightweight, crisp SVG icons)

**Backend & Integration:**
- **Pipeline Orchestration**: [n8n](https://n8n.io/) Cloud Webhooks
- **Communication Protocol**: Native Javascript `fetch` API handling both `application/json` and `multipart/form-data`.
- **Hosting**: Designed for zero-config static deployments (Vercel/Netlify).

---
*Built for the Vivriti Capital · National AI/ML Hackathon 2026*
