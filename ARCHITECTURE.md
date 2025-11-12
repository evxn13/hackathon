# 🏗️ Architecture Technique

## Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                        UTILISATEUR                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS 14 FRONTEND                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Landing     │  │  Auth Pages  │  │  Dashboard   │     │
│  │  Page        │  │ (Login/Reg)  │  │   (Main)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────┬────────────────┬────────────────┬─────────────┘
             │                │                │
             ▼                ▼                ▼
┌────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                      │
│  ┌──────────────────┐  ┌──────────────────────────┐       │
│  │ /api/insee-data  │  │ /api/analyze-company     │       │
│  └────────┬─────────┘  └────────┬─────────────────┘       │
└───────────┼────────────────────┼──────────────────────────┘
            │                    │
            ▼                    ▼
    ┌──────────────┐     ┌──────────────────┐
    │  API INSEE   │     │  Anthropic       │
    │  Sirene V3   │     │  Claude AI       │
    └──────────────┘     └──────────────────┘
            │                    │
            ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (PostgreSQL)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  companies   │  │    aides     │  │  projections │     │
│  │              │  │ recommen...  │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Frontend Architecture

### Pages Structure (App Router)

```
/app
├── page.tsx                    → Landing Page (Public)
├── layout.tsx                  → Root Layout
├── globals.css                 → Global Styles
│
├── /auth
│   ├── /login
│   │   └── page.tsx           → Login Page
│   ├── /register
│   │   └── page.tsx           → Register Page
│   └── /callback
│       └── route.ts           → OAuth Callback
│
└── /dashboard
    └── page.tsx                → Main Dashboard (Protected)
```

### Components Architecture

```
/components
├── /ui                         → Reusable UI Components
│   ├── Button.tsx             → Primary button component
│   ├── Card.tsx               → Card container + variants
│   ├── Input.tsx              → Form input with validation
│   └── Badge.tsx              → Status/type badges
│
├── /auth                       → Authentication Components
│   ├── LoginForm.tsx          → Login form logic
│   └── RegisterForm.tsx       → Register form logic
│
└── /dashboard                  → Dashboard-specific Components
    ├── SiretInput.tsx         → SIRET input + validation
    ├── CompanyCard.tsx        → Company profile display
    ├── AidesRecommendations   → Aides list with filters
    └── RevenueChart.tsx       → CA projection chart
```

## 🔧 Backend Architecture

### API Routes

#### 1. `/api/insee-data` (POST)

**Purpose** : Récupère les données entreprise depuis l'API INSEE

**Flow** :
```
Client → POST /api/insee-data { siret }
  ↓
Validate SIRET (14 digits)
  ↓
Check existing company in DB
  ↓ (if not exists)
Get INSEE Access Token
  ↓
Fetch INSEE Sirene API
  ↓
Parse & normalize data
  ↓
Insert into companies table
  ↓
Return company data
```

**Response** :
```typescript
{
  company: Company,
  source: 'database' | 'insee',
  inseeData?: InseeData
}
```

#### 2. `/api/analyze-company` (POST)

**Purpose** : Analyse le profil et génère les aides avec IA

**Flow** :
```
Client → POST /api/analyze-company { companyId }
  ↓
Fetch company from DB
  ↓
Check existing aides
  ↓ (if not exists)
Build AI prompt with company context
  ↓
Call Claude AI API (Anthropic)
  ↓
Parse JSON response
  ↓
Insert aides into DB
  ↓
Calculate revenue projection
  ↓
Return aides + projection
```

**Response** :
```typescript
{
  aides: AideRecommendation[],
  projection?: RevenueProjection,
  source: 'database' | 'ai'
}
```

### Middleware

**`middleware.ts`** : Protection des routes

```typescript
/dashboard/*     → Requires auth, redirects to /auth/login
/auth/login      → Redirects to /dashboard if authenticated
/auth/register   → Redirects to /dashboard if authenticated
```

## 🗄️ Database Architecture

### Schema ERD

```
┌─────────────────────────────────────────────────────────┐
│                    auth.users (Supabase)                │
│  - id (uuid, PK)                                        │
│  - email                                                │
│  - created_at                                           │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ 1:N
                        ▼
┌─────────────────────────────────────────────────────────┐
│                      companies                          │
│  - id (uuid, PK)                                        │
│  - user_id (uuid, FK) ──────────────────────┐           │
│  - siret (text, unique)                     │           │
│  - denomination (text)                      │           │
│  - secteur (text)                           │           │
│  - code_ape (text)                          │           │
│  - effectif (text)                          │           │
│  - localisation (text)                      │           │
│  - code_postal (text)                       │           │
│  - ca_actuel (decimal)                      │           │
│  - date_creation (date)                     │           │
│  - forme_juridique (text)                   │           │
│  - created_at, updated_at                   │           │
└───────────────────┬─────────────────────────┴───────────┘
                    │                         │
                    │ 1:N                     │ 1:N
                    ▼                         ▼
┌──────────────────────────────┐  ┌──────────────────────┐
│   aides_recommendations      │  │  revenue_projections │
│  - id (uuid, PK)             │  │  - id (uuid, PK)     │
│  - company_id (uuid, FK) ────┤  │  - company_id (FK)   │
│  - user_id (uuid, FK)        │  │  - ca_actuel         │
│  - titre (text)              │  │  - ca_projete        │
│  - description (text)        │  │  - periode           │
│  - type_aide (enum)          │  │  - avec_aides (bool) │
│  - niveau (enum)             │  │  - created_at        │
│  - montant_estime (text)     │  └──────────────────────┘
│  - organisme (text)          │
│  - criteres (text[])         │
│  - score_pertinence (decimal)│
│  - created_at                │
└──────────────────────────────┘
```

### Row Level Security (RLS)

**Companies** :
```sql
SELECT: auth.uid() = user_id
INSERT: auth.uid() = user_id
UPDATE: auth.uid() = user_id
DELETE: auth.uid() = user_id
```

**Aides Recommendations** :
```sql
SELECT: auth.uid() = user_id
INSERT: auth.uid() = user_id
UPDATE: auth.uid() = user_id
DELETE: auth.uid() = user_id
```

**Revenue Projections** :
```sql
SELECT: EXISTS (SELECT 1 FROM companies WHERE id = company_id AND user_id = auth.uid())
INSERT: EXISTS (SELECT 1 FROM companies WHERE id = company_id AND user_id = auth.uid())
UPDATE: EXISTS (SELECT 1 FROM companies WHERE id = company_id AND user_id = auth.uid())
DELETE: EXISTS (SELECT 1 FROM companies WHERE id = company_id AND user_id = auth.uid())
```

## 🔐 Security Architecture

### Authentication Flow

```
User Registration/Login
  ↓
Supabase Auth (email/password)
  ↓
JWT Token Generated
  ↓
Token stored in httpOnly cookie
  ↓
Token auto-refreshed by Supabase client
  ↓
Middleware validates on protected routes
```

### Data Security Layers

1. **Transport** : HTTPS/TLS (Vercel auto)
2. **Authentication** : Supabase Auth (JWT)
3. **Authorization** : RLS Policies
4. **Validation** : Zod schemas
5. **Secrets** : Environment variables

## 🧠 AI Integration Architecture

### Claude AI Prompt Engineering

**Input** :
```
Company Profile:
- SIRET
- Sector (APE)
- Size (employees)
- Location
- Age
- Legal form
```

**Processing** :
```
Claude AI analyzes:
1. Sector eligibility
2. Size criteria
3. Geographic scope
4. Innovation potential
5. Growth stage
```

**Output** :
```json
{
  "aides": [
    {
      "titre": "...",
      "description": "...",
      "type_aide": "subvention|accompagnement|incubateur|pret",
      "niveau": "local|régional|national|européen",
      "montant_estime": "...",
      "organisme": "...",
      "criteres_eligibilite": ["...", "..."],
      "score_pertinence": 0.85
    }
  ]
}
```

### Token Management

- Model: `claude-3-5-sonnet-20241022`
- Average prompt: ~800 tokens
- Average response: ~2000 tokens
- Cost per analysis: ~$0.01

## 📊 State Management

### Client State

**React State** (useState/useEffect)
- User session
- Form inputs
- Loading states
- UI states

**No global state needed** (simple MVP)

### Server State

**Supabase Real-time** (optional future)
- Could enable live updates
- Not implemented in MVP

## 🚀 Performance Optimizations

### Frontend

1. **Next.js App Router** :
   - Server Components by default
   - Client Components only when needed
   - Automatic code splitting

2. **Images** :
   - Next.js Image optimization
   - Lazy loading

3. **Styles** :
   - Tailwind CSS (PurgeCSS automatic)
   - Critical CSS inline

### Backend

1. **API Routes** :
   - Edge runtime capable
   - Serverless functions

2. **Database** :
   - Indexed foreign keys
   - Connection pooling (Supabase)

3. **Caching** :
   - INSEE data cached in DB
   - Aides cached after generation

## 🔄 Data Flow

### Complete User Journey

```
1. User lands on homepage
   ↓
2. Registers/Logs in (Supabase Auth)
   ↓
3. Enters SIRET
   ↓
4. Frontend validates format
   ↓
5. POST /api/insee-data
   ↓
6. Backend fetches INSEE (or DB)
   ↓
7. Company profile displayed
   ↓
8. User clicks "Analyze"
   ↓
9. POST /api/analyze-company
   ↓
10. Backend calls Claude AI (or DB)
    ↓
11. Aides generated & stored
    ↓
12. Dashboard displays results
    ↓
13. User filters/explores aides
```

## 📦 Dependencies

### Production

```json
{
  "@anthropic-ai/sdk": "AI integration",
  "@supabase/supabase-js": "Database & Auth",
  "@supabase/auth-helpers-nextjs": "Auth helpers",
  "next": "Framework",
  "react": "UI library",
  "recharts": "Charts",
  "zod": "Validation",
  "lucide-react": "Icons"
}
```

### Development

```json
{
  "typescript": "Type safety",
  "tailwindcss": "Styling",
  "eslint": "Linting",
  "@types/*": "Type definitions"
}
```

## 🌐 Deployment Architecture

```
GitHub Repository
  ↓ (push to main)
Vercel CI/CD
  ↓
Build Next.js
  ↓
Deploy to Edge Network
  ↓
Global CDN (200+ cities)
  ↓
Users worldwide (<100ms latency)
```

### Edge Functions

All API routes run on Vercel Edge:
- Auto-scaling
- Global distribution
- 0ms cold starts

## 📈 Scalability Considerations

### Current MVP Limits

- **Users** : ~100 concurrent (Supabase free)
- **API Calls** : Limited by credits
- **Storage** : 500 MB (Supabase free)

### Scaling Path

1. **Phase 1** (0-1000 users) :
   - Current architecture sufficient
   - Monitor Supabase usage

2. **Phase 2** (1k-10k users) :
   - Upgrade Supabase ($25/mo)
   - Add Redis caching
   - Implement rate limiting

3. **Phase 3** (10k+ users) :
   - Microservices for AI
   - Queue system (Bull/BullMQ)
   - Dedicated PostgreSQL
   - CDN for assets

---

**Architecture designed for rapid MVP development with clear scaling path** 🚀
