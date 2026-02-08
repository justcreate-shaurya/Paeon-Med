# Paeon AI: The Intelligent Digital Medical Representative

> **Track:** 2 (Digital Medical Representative)  
> **Team:** Paeon AI  
> **Hackathon:** Medithon 2026
> **Members:** Shaurya Jain | Tanvir Singh Sandhu | Swapneel Premchand | Suchethan PH


---

## Overview

**Paeon AI** is a full-stack, voice-enabled pharmaceutical intelligence platform designed for medical representatives in the field. It combines real-time drug intelligence, company profiling, insurance coverage lookup, and a **live multilingual voice AI agent** — all accessible from a modern web interface.

Unlike traditional chatbots, Paeon acts as an **Agentic Sales Partner** that can:
- Answer complex clinical questions via voice in **15+ languages**
- Provide instant drug comparisons, dosing, and mechanism of action
- Check insurance coverage (Ayushman Bharat, CGHS, private TPAs)
- Surface compliance-verified information from approved product labels

---

## The Problem

Pharma spends billions on strategy, but execution fails in the **3 minutes** a rep has with a doctor.

| Challenge | Impact |
|-----------|--------|
| **Information Overload** | Reps can't memorize 100+ pages of clinical labels |
| **Compliance Fear** | Hesitation around off-label queries or pricing discussions |
| **Access Barriers** | Doctors skip prescriptions when insurance coverage is unclear |
| **Language Diversity** | India has 22 official languages; English-only tools fail |

---

## The Solution

A **three-tier intelligence platform** with voice-first interaction:

### 1. Voice AI Agent (Browser-Based Calls)
- **One-click calling** via floating button — no phone needed
- **Real-time speech-to-text** with automatic language detection
- **Multilingual TTS** using Google Neural2 voices (Hindi, Tamil, Telugu, Bengali, etc.)
- **Gemini 2.0 Flash** for intelligent, context-aware responses
- Works entirely in the browser via WebSocket streaming

### 2. Drug Intelligence Engine
- Instant drug search across therapeutic categories
- **Side-by-side comparison tables** (efficacy, safety, dosing)
- Mechanism of action cards with visual molecular pathways
- Insurance & reimbursement status per drug

### 3. Company Intelligence Hub
- Manufacturer profiles (Cipla, Pfizer, Sun Pharma, Emcure, etc.)
- Hero products, supported specialties, mission statements
- Quick context for reps visiting specific accounts

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Floating Call Button** | Click-to-call voice AI from any page |
| **Multilingual Voice** | Speak in Hindi, Tamil, Telugu, Bengali, Marathi — AI responds in your language |
| **Drug Search** | Fast fuzzy search with therapeutic filtering |
| **Comparison Tables** | Head-to-head drug comparisons on efficacy, safety, dosing |
| **Coverage Status** | Ayushman Bharat, CGHS, Star Health, HDFC Ergo lookup |
| **Compliance Guardrails** | Blocks off-topic queries, enforces medical-only content |
| **Talk More Panel** | Conversational follow-up Q&A for deeper clinical questions |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Vite + React)                 │
│                     http://localhost:3000                   │
│  ┌─────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │ SearchBar   │  │ FloatingCall   │  │ DrugIdentity    │  │
│  │ (Drug/Co)   │  │ Button (Voice) │  │ ComparisonTable │  │
│  └──────┬──────┘  └───────┬────────┘  └────────┬────────┘  │
│         │                 │                     │           │
└─────────┼─────────────────┼─────────────────────┼───────────┘
          │                 │                     │
          ▼                 ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ FastAPI Backend │  │ Calling Agent   │  │ Static Assets   │
│ :8000           │  │ :3001 (WS)      │  │ (Companies,     │
│                 │  │                 │  │  Drugs JSON)    │
│ • /drug-search  │  │ • Google STT    │  └─────────────────┘
│ • /drug-profile │  │ • Google TTS    │
│ • /company-prof │  │ • Gemini LLM    │
│ • /ask (Q&A)    │  │ • Translate API │
│ • /guardrail    │  │                 │
└────────┬────────┘  └────────┬────────┘
         │                    │
         ▼                    ▼
   ┌───────────────────────────────┐
   │      Google Cloud APIs        │
   │  • Vertex AI (Gemini 2.0)     │
   │  • Cloud Speech-to-Text       │
   │  • Cloud Text-to-Speech       │
   │  • Cloud Translation v2       │
   └───────────────────────────────┘
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Vite 6** | Build tooling & dev server |
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **Radix UI** | Accessible component primitives |
| **Motion (Framer)** | Fluid animations |
| **Lucide Icons** | Icon library |

### Backend (FastAPI)
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance Python API |
| **Pydantic v2** | Request/response validation |
| **Google GenAI** | Gemini integration for RAG |
| **Uvicorn** | ASGI server |

### Voice AI Agent (Node.js)
| Technology | Purpose |
|------------|---------|
| **Express + WS** | WebSocket server for real-time audio |
| **@google-cloud/speech** | Speech-to-Text (multilingual) |
| **@google-cloud/text-to-speech** | Neural2 TTS voices |
| **@google-cloud/translate** | Real-time translation |
| **@google-cloud/vertexai** | Gemini 2.0 Flash LLM |

---

## Project Structure

```
Paeon-2.0-Med/
├── main.py                    # FastAPI entry point
├── requirements.txt           # Python dependencies
├── app/
│   ├── core/
│   │   ├── llm_adapter.py     # Gemini API wrapper
│   │   ├── schemas.py         # Pydantic models
│   │   ├── brand_loader.py    # Drug data loader
│   │   └── company_loader.py  # Company data loader
│   ├── engines/
│   │   ├── guardrails.py      # Content compliance
│   │   ├── policy_reimbursement.py
│   │   └── product_intelligence.py
│   └── routes/
│       ├── ask.py             # POST /api/ask
│       ├── drug_search.py     # POST /api/drug-search
│       ├── profile.py         # POST /api/drug-profile
│       ├── company.py         # POST /api/company-profile
│       └── guardrail.py       # POST /api/guardrail
├── Calling agent/
│   ├── server.js              # WebSocket voice server
│   ├── lib/
│   │   ├── googleService.js   # Google Cloud API calls
│   │   ├── callSession.js     # Voice call state machine
│   │   └── audioUtils.js      # Mulaw/PCM conversion
│   └── data/
│       └── product-info.txt   # Product knowledge base (1400+ lines)
├── FE/
│   ├── src/
│   │   ├── App.tsx            # Main app component
│   │   ├── components/
│   │   │   ├── FloatingCallButton.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── DrugIdentity.tsx
│   │   │   ├── ComparisonTable.tsx
│   │   │   ├── CompanyOverview.tsx
│   │   │   ├── CoverageStatus.tsx
│   │   │   ├── MechanismCard.tsx
│   │   │   └── TalkMore.tsx
│   │   ├── hooks/
│   │   │   └── useCallAgent.ts  # Voice call React hook
│   │   └── api/
│   │       ├── drugSearch.ts
│   │       ├── drugProfile.ts
│   │       └── companyProfile.ts
│   └── package.json
├── data/
│   ├── brands.json            # Drug database
│   ├── companies.json         # Company profiles
│   ├── policies.json          # Insurance policies
│   └── documents.json         # RAG document store
└── tests/
    ├── test_guardrails.py
    ├── test_policy_engine.py
    └── test_rag_engine.py
```

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 18.0.0
- **Python** ≥ 3.10
- **Google Cloud** project with Speech, TTS, Translation, and Vertex AI APIs enabled
- Service account JSON with appropriate permissions

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/Paeon-2.0-Med.git
cd Paeon-2.0-Med
```

### 2. Backend Setup (FastAPI)
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your GOOGLE_API_KEY

# Start backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Voice Agent Setup (Node.js)
```bash
cd "Calling agent"
npm install

# Configure environment
cp .env.example .env
# Set GOOGLE_APPLICATION_CREDENTIALS and GOOGLE_PROJECT_ID

# Start voice server
npm start
```

### 4. Frontend Setup (Vite + React)
```bash
cd FE
npm install
npm run dev
```

### 5. Open the App
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/docs
- **Voice Agent:** ws://localhost:3001/media-stream

---

## Environment Variables

### Backend (.env)
```env
GOOGLE_API_KEY=your_gemini_api_key
```

### Calling Agent (.env)
```env
PORT=3001
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
GOOGLE_PROJECT_ID=your-gcp-project
GOOGLE_LOCATION=us-central1
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/drug-search` | Fuzzy search drugs by name/category |
| POST | `/api/drug-profile` | Get detailed drug information |
| POST | `/api/company-profile` | Get company overview |
| POST | `/api/ask` | Conversational Q&A about drugs |
| POST | `/api/guardrail` | Check if query is medical/compliant |
| GET | `/api/health` | Health check |

---

## Voice Call Flow

```
User clicks 🎙️ → Browser captures mic → 
  Audio resampled to 8kHz mulaw → 
    WebSocket → Calling Agent →
      Google STT (auto-detect language) →
        Translate to English (if needed) →
          Gemini 2.0 Flash (reasoning) →
            Translate response back →
              Google TTS (Neural2 voice) →
                Stream audio to browser → 
                  Play through speaker
```

**Supported Languages:** English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Punjabi, Kannada, Malayalam, Urdu, Spanish, French, German, Portuguese, Japanese, Korean, Arabic, Chinese, Russian, and more.

---

## Testing

```bash
# Backend tests
pytest tests/

# Voice agent tests
cd "Calling agent"
npm test
```

---

## Roadmap

- [ ] **Twilio Integration** — Real phone number for voice calls
- [ ] **CRM Sync** — Direct API link to Indegene Omnipresence
- [ ] **Offline Mode** — Edge-cached drug database for low-connectivity areas
- [ ] **Analytics Dashboard** — Voice-of-customer sentiment analysis
- [ ] **iPad Optimization** — Native tablet experience for field force

---

## License

Proprietary — Paeon AI Team

---

## Team

Built with ❤️ for **Medithon 2026** by the Paeon AI team at Plaksha University.
