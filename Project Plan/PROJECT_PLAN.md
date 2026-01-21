# PRMF Premium Rate Calculator - Project Plan

## 📋 Project Overview

**Project Name:** PRMF Premium Rate Calculator  
**Version:** 1.0  
**Date:** January 21, 2026  
**Author:** Robin Ochieng

### Objective
Build a web-based premium rate calculator for a medical insurance product that calculates premiums based on:
- **Age** (18-90 years)
- **Benefit Option** (Option I, II, III, IV)
- **Family Size** (M = Principal Only, M+1 = Principal + Spouse)

The calculator will display the appropriate premium amount with a clear indication of whether it's a **Lumpsum** (ages 61-90) or **Annual** (ages 18-60) payment.

---

## 🛠 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14+ (App Router) | React-based UI with SSR capabilities |
| **Backend** | FastAPI (Python) | API layer for business logic (optional - can use Next.js API routes) |
| **Database** | Supabase (PostgreSQL) | Store premium rate tables |
| **Styling** | Tailwind CSS | Responsive UI styling |
| **Deployment** | Vercel (Frontend) / Railway or Render (Backend) | Hosting |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│                    (Next.js Frontend)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Age Input   │  │ Benefit     │  │ Family Size             │  │
│  │ (18-90)     │  │ Dropdown    │  │ (M / M+1)               │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                    ┌─────────────┐                              │
│                    │ CALCULATE   │                              │
│                    └─────────────┘                              │
│                          │                                      │
└──────────────────────────│──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API LAYER                                   │
│            (Next.js API Routes OR FastAPI)                      │
│                                                                 │
│  • Validate input parameters                                    │
│  • Determine payment type (Lumpsum/Annual)                      │
│  • Query Supabase for premium rate                              │
│  • Return formatted response                                    │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SUPABASE DATABASE                           │
│                                                                 │
│  Tables:                                                        │
│  ├── premium_rates_m (Principal Only)                           │
│  │   └── age, option_1, option_2, option_3, option_4, type      │
│  │                                                              │
│  └── premium_rates_m_plus_1 (Principal + Spouse)                │
│      └── age, option_1, option_2, option_3, option_4, type      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

### Option A: Normalized Schema (Recommended)

```sql
-- Premium Rates Table
CREATE TABLE premium_rates (
    id SERIAL PRIMARY KEY,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 90),
    family_size VARCHAR(10) NOT NULL CHECK (family_size IN ('M', 'M+1')),
    payment_type VARCHAR(10) NOT NULL CHECK (payment_type IN ('LUMPSUM', 'ANNUAL')),
    option_1 DECIMAL(15, 2) NOT NULL,
    option_2 DECIMAL(15, 2) NOT NULL,
    option_3 DECIMAL(15, 2) NOT NULL,
    option_4 DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(age, family_size)
);

-- Index for faster lookups
CREATE INDEX idx_premium_rates_lookup ON premium_rates(age, family_size);
```

### Option B: Separate Tables Schema

```sql
-- M Only Rates
CREATE TABLE premium_rates_m (
    id SERIAL PRIMARY KEY,
    age INTEGER NOT NULL UNIQUE CHECK (age >= 18 AND age <= 90),
    payment_type VARCHAR(10) NOT NULL CHECK (payment_type IN ('LUMPSUM', 'ANNUAL')),
    option_1 DECIMAL(15, 2) NOT NULL,
    option_2 DECIMAL(15, 2) NOT NULL,
    option_3 DECIMAL(15, 2) NOT NULL,
    option_4 DECIMAL(15, 2) NOT NULL
);

-- M+1 Rates
CREATE TABLE premium_rates_m_plus_1 (
    id SERIAL PRIMARY KEY,
    age INTEGER NOT NULL UNIQUE CHECK (age >= 18 AND age <= 90),
    payment_type VARCHAR(10) NOT NULL CHECK (payment_type IN ('LUMPSUM', 'ANNUAL')),
    option_1 DECIMAL(15, 2) NOT NULL,
    option_2 DECIMAL(15, 2) NOT NULL,
    option_3 DECIMAL(15, 2) NOT NULL,
    option_4 DECIMAL(15, 2) NOT NULL
);
```

---

## 📁 Project Structure

```
prmf-calculator/
├── frontend/                    # Next.js Application
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main calculator page
│   │   ├── globals.css         # Global styles
│   │   └── api/
│   │       └── calculate/
│   │           └── route.ts    # API endpoint for calculation
│   ├── components/
│   │   ├── Calculator/
│   │   │   ├── CalculatorForm.tsx
│   │   │   ├── AgeInput.tsx
│   │   │   ├── BenefitSelect.tsx
│   │   │   ├── FamilySizeSelect.tsx
│   │   │   └── ResultDisplay.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       └── Card.tsx
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   └── utils.ts            # Utility functions
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── .env.local              # Environment variables
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # FastAPI (Optional)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI app entry
│   │   ├── routers/
│   │   │   └── calculator.py   # Calculator endpoints
│   │   ├── models/
│   │   │   └── schemas.py      # Pydantic models
│   │   ├── services/
│   │   │   └── premium.py      # Business logic
│   │   └── database/
│   │       └── supabase.py     # Supabase connection
│   ├── requirements.txt
│   └── .env
│
├── scripts/
│   ├── seed_database.py        # Script to import Excel rates to Supabase
│   └── Rates.xlsx              # Source rate file
│
├── docs/
│   └── API.md                  # API documentation
│
└── README.md
```

---

## 🎯 Features & Requirements

### Functional Requirements

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| FR-01 | Age Input | Number input field accepting values 18-90 | High |
| FR-02 | Benefit Selection | Dropdown with Options I, II, III, IV | High |
| FR-03 | Family Size Selection | Radio buttons or dropdown for M / M+1 | High |
| FR-04 | Calculate Button | Triggers premium calculation | High |
| FR-05 | Premium Display | Shows calculated premium in KES | High |
| FR-06 | Payment Type Indicator | Displays "LUMPSUM" or "ANNUAL" badge/note | High |
| FR-07 | Input Validation | Validate age range and required fields | High |
| FR-08 | Error Handling | Display user-friendly error messages | Medium |
| FR-09 | Responsive Design | Mobile-friendly UI | Medium |
| FR-10 | Loading States | Show loading spinner during calculation | Low |

### Non-Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-01 | Performance | API response time < 500ms |
| NFR-02 | Availability | 99.9% uptime |
| NFR-03 | Security | Secure Supabase connection with RLS |
| NFR-04 | Scalability | Handle concurrent users |
| NFR-05 | Accessibility | WCAG 2.1 AA compliant |

---

## 📅 Project Timeline

### Phase 1: Setup & Database (Days 1-2)
- [ ] Set up Supabase project
- [ ] Create database schema
- [ ] Import premium rates from Excel to Supabase
- [ ] Test database queries

### Phase 2: Backend Development (Days 3-4)
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Supabase client
- [ ] Create API route for premium calculation
- [ ] Implement business logic (age-based payment type)
- [ ] Add input validation

### Phase 3: Frontend Development (Days 5-7)
- [ ] Design UI mockup
- [ ] Build calculator form components
- [ ] Implement form state management
- [ ] Create result display component
- [ ] Add payment type disclaimer/note
- [ ] Style with Tailwind CSS

### Phase 4: Integration & Testing (Days 8-9)
- [ ] Connect frontend to API
- [ ] End-to-end testing
- [ ] Fix bugs and edge cases
- [ ] Performance optimization

### Phase 5: Deployment (Day 10)
- [ ] Deploy frontend to Vercel
- [ ] Configure environment variables
- [ ] Final testing in production
- [ ] Documentation

---

## 🔌 API Specification

### Calculate Premium Endpoint

**Endpoint:** `POST /api/calculate` (Next.js) or `POST /calculate` (FastAPI)

**Request Body:**
```json
{
    "age": 45,
    "benefit_option": "option_2",
    "family_size": "M"
}
```

**Response (Success):**
```json
{
    "success": true,
    "data": {
        "age": 45,
        "family_size": "M",
        "benefit_option": "Option II",
        "premium_amount": 315211.36,
        "payment_type": "ANNUAL",
        "currency": "KES",
        "disclaimer": "This is an ANNUAL premium payment. Applicable for ages 18-60."
    }
}
```

**Response (Error):**
```json
{
    "success": false,
    "error": {
        "code": "INVALID_AGE",
        "message": "Age must be between 18 and 90"
    }
}
```

---

## 🖼 UI Mockup

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                   PRMF Premium Calculator                      │
│                   ────────────────────────                     │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │   Age                                                    │  │
│  │   ┌──────────────────────────────────────┐              │  │
│  │   │  45                              ▼   │              │  │
│  │   └──────────────────────────────────────┘              │  │
│  │                                                          │  │
│  │   Benefit Option                                         │  │
│  │   ┌──────────────────────────────────────┐              │  │
│  │   │  Option II                       ▼   │              │  │
│  │   └──────────────────────────────────────┘              │  │
│  │                                                          │  │
│  │   Family Size                                            │  │
│  │   ○ M (Principal Only)                                   │  │
│  │   ● M+1 (Principal + Spouse)                             │  │
│  │                                                          │  │
│  │   ┌──────────────────────────────────────┐              │  │
│  │   │          CALCULATE                   │              │  │
│  │   └──────────────────────────────────────┘              │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │   Your Premium                              [ANNUAL]     │  │
│  │   ─────────────────────────────────────────────────      │  │
│  │                                                          │  │
│  │   KES 512,218.46                                         │  │
│  │                                                          │  │
│  │   ⓘ This is an ANNUAL premium. Premiums for ages        │  │
│  │     18-60 are paid annually. Ages 61-90 pay a           │  │
│  │     one-time LUMPSUM amount.                            │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (.env) - If using FastAPI
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

---

## 📝 Business Logic

### Payment Type Determination
```python
def get_payment_type(age: int) -> str:
    """
    Determine payment type based on age.
    
    Args:
        age: Member's age (18-90)
    
    Returns:
        'LUMPSUM' for ages 61-90 (retirees)
        'ANNUAL' for ages 18-60 (active members)
    """
    if age >= 61 and age <= 90:
        return "LUMPSUM"
    elif age >= 18 and age <= 60:
        return "ANNUAL"
    else:
        raise ValueError("Age must be between 18 and 90")
```

### Disclaimer Messages
```python
DISCLAIMERS = {
    "LUMPSUM": "This is a LUMPSUM (one-time) premium payment applicable for retirees aged 61-90.",
    "ANNUAL": "This is an ANNUAL premium payment applicable for active members aged 18-60."
}
```

---

## ✅ Acceptance Criteria

1. **User can enter age** between 18-90; values outside range show error
2. **User can select benefit option** from dropdown (I, II, III, IV)
3. **User can select family size** (M or M+1)
4. **Calculate button** is disabled until all fields are filled
5. **Premium displays correctly** in KES with proper formatting (commas, 2 decimals)
6. **Payment type badge** shows "LUMPSUM" or "ANNUAL" prominently
7. **Disclaimer text** explains the payment type clearly
8. **Database query** returns correct rate from Supabase
9. **Application is responsive** on mobile devices
10. **Error states** are handled gracefully

---

## 🚀 Next Steps

1. **Create Supabase Project** - Set up new project at supabase.com
2. **Run Database Migration** - Create tables using provided schema
3. **Seed Database** - Import rates from Rates.xlsx
4. **Initialize Next.js Project** - `npx create-next-app@latest`
5. **Start Development** - Follow phase-by-phase plan

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Document Version:** 1.0  
**Last Updated:** January 21, 2026
