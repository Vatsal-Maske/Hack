# 🛡️ FinGuard AI - Real-Time Financial Fraud Detection Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.13-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-16.1.6-black.svg)

**An intelligent, production-grade fraud detection system powered by Machine Learning**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [How It Works](#-how-it-works) • [API Docs](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [The Problem We Solve](#-the-problem-we-solve)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [AI/ML Model Explained](#-aiml-model-explained)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Frontend Features](#-frontend-features)
- [How We Built It](#-how-we-built-it)
- [Screenshots](#-screenshots)
- [Future Roadmap](#-future-roadmap)

---

## 🌟 Overview

**FinGuard AI** is a full-stack, enterprise-grade financial fraud detection and prevention platform that enables banks, fintech companies, and financial analysts to detect, analyze, and block fraudulent transactions in real-time.

The platform combines **machine learning-powered anomaly detection** with a **modern, intuitive web interface** to provide instant fraud risk assessment, comprehensive transaction monitoring, and immediate remedial actions.

### Key Highlights

- ⚡ **Real-Time Detection**: Fraud predictions in < 100ms
- 🤖 **ML-Powered**: IsolationForest anomaly detection algorithm
- 📊 **Live Analytics**: Auto-refreshing dashboards with KPIs
- 🔐 **Secure Authentication**: Firebase Auth with Google Sign-In
- 🎨 **Modern UI/UX**: Dark/Light mode with polished fintech design
- 📄 **Professional Reports**: Generate PDF fraud investigation reports
- 🚨 **Instant Actions**: Block suspicious transactions with one click

---

## 🎯 The Problem We Solve

### The Challenge

Financial fraud costs the global economy over **$5 trillion annually**. Traditional fraud detection systems face critical limitations:

- **Slow Adaptation** — Rule-based systems can't keep up with evolving fraud patterns
- **High False Positives** — Customers face unnecessary transaction blocks
- **Manual Reviews** — Analysts spend hours reviewing flagged transactions
- **Delayed Response** — By the time fraud is detected, money is often gone
- **Poor Visibility** — Lack of real-time insights into fraud trends

### Our Solution

FinGuard AI addresses these challenges through:

1. **Machine Learning** — Automatically adapts to new fraud patterns without manual rule updates
2. **Anomaly Detection** — Focuses on unusual behavior rather than rigid rules
3. **Real-Time Processing** — Analyzes transactions instantly as they occur
4. **Intelligent Scoring** — Provides nuanced risk scores instead of binary decisions
5. **Analyst Empowerment** — Professional tools for detailed fraud investigation
6. **Automated Reporting** — Generate professional PDF reports instantly

---

## ✨ Features

### 🔍 Core Functionality

#### 1. **Real-Time Fraud Detection**
- Submit transaction details (amount, time) through intuitive web interface
- ML model analyzes and returns fraud prediction in milliseconds
- Visual risk score indicator with color-coded severity levels
- Instant feedback with prediction confidence

#### 2. **Transaction Details Modal**
- **Professional Fraud Analysis Panel** with 4 comprehensive sections:
  - **Transaction Information** — ID, amount, date/time, status
  - **Account Flow** — Visual representation of sender → recipient
  - **AI Risk Analysis** — Fraud score, prediction, risk level with color coding
  - **Fraud Indicators** — Detailed AI reasoning for fraud classification
- View complete transaction analysis before taking action
- Contextual fraud reasoning based on:
  - Unusual transaction times (late night/early morning)
  - Abnormal amounts (too high or too low)
  - Deviation from normal behavior patterns
  - High-risk time windows

#### 3. **PDF Report Generation**
- **One-Click Download** — Generate professional fraud investigation reports
- **Comprehensive Format** — Includes all transaction details and AI analysis
- **Professional Layout** — FinGuard AI branding with clean typography
- **Auto-Naming** — Files saved as `fraud_report_<transactionId>.pdf`
- **Instant Generation** — No server processing, client-side PDF creation
- Perfect for compliance, auditing, and record-keeping

#### 4. **Transaction Management**
- **Complete History** — All transactions stored in persistent SQLite database
- **Sortable Tables** — Filter and sort by date, amount, risk score
- **Status Tracking** — ACTIVE vs BLOCKED transaction states
- **Bulk Actions** — Manage multiple transactions efficiently

#### 5. **Block Transaction Workflow**
- One-click blocking for fraudulent transactions
- Instant status update with visual confirmation
- API-powered state synchronization
- Only available for FRAUD predictions that are still ACTIVE
- Prevents duplicate blocking attempts

#### 6. **Executive Analytics Dashboard**
- **4 Live KPI Cards**:
  - Total Transactions (with trend indicator)
  - Fraud Count (absolute numbers)
  - Fraud Rate (percentage calculation)
  - Latest Risk Score (real-time)
- **Visual Analytics**:
  - Bar Chart — Fraud vs Normal count comparison
  - Donut Chart — Distribution percentage breakdown
- **Recent Activity Feed** — Latest 5 transactions with quick actions
- **Auto-Refresh** — Polls API every 5 seconds for live updates
- **Animated Updates** — Flash effects on new fraud detections

#### 7. **Transaction Simulator**
- **Automated Testing** — Start/Stop transaction stream generator
- **Random Patterns** — Mix of normal and fraudulent transaction profiles
- **Real-Time Flow** — Simulates live transaction processing
- **Development Tool** — Test dashboard updates and ML model behavior
- **Configurable Rate** — Control transaction generation frequency

### 🔐 Authentication & Security

#### 8. **Firebase Authentication**
- **Google Sign-In Only** — Streamlined OAuth authentication
- **User Management** — Firestore integration for user profiles
- **Auto-Provisioning** — User documents created on first login
- **Session Persistence** — Maintained across page refreshes
- **Protected Routes** — Access control for authenticated users only
- **User Profiles** — Name, email, role, and creation timestamp

#### 9. **Role-Based Access**
- User roles stored in Firestore
- Extensible permission system
- Analyst-focused interface
- Future: Admin, Manager, Viewer roles

### 🎨 UI/UX Features

#### 10. **Dark/Light Mode Toggle**
- **Theme Switcher** — Toggle between dark and light themes
- **Persistent Preference** — Uses localStorage for cross-session memory
- **Smooth Transitions** — 300ms CSS animations
- **CSS Variables** — Dynamic color scheme switching
- **Accessible Icons** — 🌙 Moon and ☀️ Sun indicators
- **Responsive Colors** — All components adapt to current theme

#### 11. **Production-Grade Design**
- **Fintech Aesthetic** — Dark theme with ambient glow backgrounds
- **Skeleton Loaders** — Shimmer effects during data fetches
- **Micro-Interactions** — Hover states, transitions, animations
- **Responsive Layout** — Mobile, tablet, and desktop optimized
- **Frosted Glass Effects** — Backdrop blur on modals and navbars
- **Color-Coded States** — Red (fraud), Green (normal), Amber (medium risk)
- **Sticky Elements** — Fixed navbar and table headers
- **Visual Hierarchy** — Clear information architecture

---

## 🛠️ Tech Stack

### Backend (Python)

| Technology | Purpose | Version |
|------------|---------|---------|
| **FastAPI** | Modern async web framework | Latest |
| **Uvicorn** | ASGI server | Latest |
| **scikit-learn** | Machine learning library | Latest |
| **IsolationForest** | Anomaly detection algorithm | (scikit-learn) |
| **Pandas** | Data manipulation | Latest |
| **NumPy** | Numerical computing | Latest |
| **SQLAlchemy** | ORM for database operations | Latest |
| **SQLite** | Lightweight SQL database | 3.x |
| **Joblib** | Model serialization | Latest |
| **Pydantic** | Data validation | Latest |

### Frontend (TypeScript)

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with App Router | 16.1.6 |
| **React** | UI library | 19.2.3 |
| **TypeScript** | Type-safe JavaScript | 5.x |
| **Tailwind CSS** | Utility-first CSS framework | 4.x |
| **Axios** | HTTP client | 1.13.5 |
| **Recharts** | Chart library | 3.7.0 |
| **Firebase** | Authentication & Firestore | 12.9.0 |
| **jsPDF** | PDF generation | 4.2.0 |
| **html2canvas** | HTML to canvas conversion | 1.4.1 |

### Development Tools

- **Python 3.13** — Backend runtime
- **Node.js 18+** — Frontend runtime
- **npm** — Package manager
- **PowerShell** — Windows terminal
- **VS Code** — Code editor
- **Git** — Version control

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Dashboard │  │   Detect   │  │   Login    │            │
│  │    Page    │  │    Page    │  │    Page    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         │                 │                │                 │
│         └─────────────────┴────────────────┘                │
│                          │                                   │
│                  ┌───────▼────────┐                         │
│                  │   API Service   │                         │
│                  │   (Axios)       │                         │
│                  └───────┬────────┘                         │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    HTTP REST API
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      BACKEND LAYER                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │              FastAPI Application                    │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │    │
│  │  │  /predict│  │/transactions│ │  /block  │        │    │
│  │  └────┬─────┘  └─────┬──────┘ └────┬─────┘        │    │
│  │       │              │              │               │    │
│  │  ┌────▼─────────────▼──────────────▼────┐         │    │
│  │  │      Service Layer                    │         │    │
│  │  │  (transaction.py, simulator.py)       │         │    │
│  │  └────┬──────────────────────────────────┘         │    │
│  └───────┼──────────────────────────────────────────────┘  │
│          │                │                                  │
│     ┌────▼─────┐    ┌────▼────────┐                        │
│     │    ML    │    │   Database   │                        │
│     │  Model   │    │   (SQLite)   │                        │
│     │          │    │              │                        │
│     │ predict  │    │ transactions │                        │
│     │  .py     │    │   table      │                        │
│     └──────────┘    └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌────────────────┐          ┌────────────────┐            │
│  │    Firebase    │          │   Firestore    │            │
│  │      Auth      │          │    Database    │            │
│  │ (Google OAuth) │          │  (User Profiles)│            │
│  └────────────────┘          └────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Authentication Flow**:
   ```
   User → Google OAuth → Firebase Auth → User Document → Protected Routes
   ```

2. **Fraud Detection Flow**:
   ```
   Form Input → API Request → ML Model → Database Storage → Response → UI Update
   ```

3. **Dashboard Flow**:
   ```
   Dashboard Load → API Polling (5s) → Data Fetch → Chart Render → KPI Update
   ```

4. **Block Action Flow**:
   ```
   Block Button → API PATCH → DB Update → State Sync → UI Refresh
   ```

---

## 🤖 AI/ML Model Explained

### The Algorithm: IsolationForest

**IsolationForest** is an unsupervised machine learning algorithm specifically designed for **anomaly detection**. It's perfect for fraud detection because:

#### Why Isolation Forest?

1. **Anomaly-Focused** — Built to find outliers, not classify known patterns
2. **Unsupervised** — Doesn't require labeled fraud data to train
3. **Fast** — Efficient even with large datasets
4. **Effective** — Works well when frauds are rare but distinct
5. **Interpretable** — Provides anomaly scores for risk ranking

#### How It Works

**Core Principle**: Anomalies are "few and different" — they're easier to isolate than normal points.

**The Process**:

1. **Random Tree Construction**
   - Randomly select a feature (amount or time)
   - Randomly select a split value between min and max
   - Recursively partition the data
   - Build multiple random trees (forest)

2. **Path Length Measurement**
   - For each transaction, measure how many splits needed to isolate it
   - **Short paths** = easy to isolate = **ANOMALY**
   - **Long paths** = hard to separate = **NORMAL**

3. **Score Calculation**
   - Average path lengths across all trees
   - Normalize to create anomaly score
   - Higher score = more anomalous = higher fraud risk

**Visual Intuition**:

```
Normal Transactions (clustered):
    ┌─────────────────┐
    │ ● ● ● ● ● ● ● ● │  ← Takes many splits to isolate
    │ ● ● ● ● ● ● ● ● │     any single point
    │ ● ● ● ● ● ● ● ● │
    └─────────────────┘

Fraud Transactions (isolated):
                          ●  ← Only 1-2 splits needed!
                             (far from normal cluster)
```

### Our Implementation

#### Training Data Generation

We create **synthetic transaction data** to train the model:

**Normal Transactions** (1000 samples):
- **Amount**: $1 - $500 (small to medium)
- **Time**: 8:00 AM - 8:00 PM (business hours)
- **Pattern**: Typical daily banking activity

**Fraudulent Transactions** (50 samples):
- **Amount**: $5,000 - $20,000 (very high)
- **Time**: 12:00 AM - 5:00 AM (late night)
- **Pattern**: Unusual large transfers at odd hours

#### Model Configuration

```python
IsolationForest(
    contamination=0.02,  # Expect 2% fraud rate
    random_state=42       # Reproducibility
)
```

- **Contamination**: Proportion of dataset expected to be anomalies
- **Random State**: Ensures consistent results across runs

#### Feature Engineering

We use **2 features** for simplicity and effectiveness:

1. **Amount** — Transaction value in USD
   - Fraud often involves unusually large amounts
   - Captures financial anomalies

2. **Time** — Hour of day (0-23)
   - Fraud often occurs during odd hours
   - Captures temporal patterns

**Preprocessing**:
- **StandardScaler** normalizes both features to same scale
- Prevents amount (large numbers) from dominating time (0-23)
- ML models work better with normalized data

#### Prediction Process

When a new transaction arrives:

```python
def predict_fraud(amount: float, time: float):
    # 1. Create feature vector
    features = [[amount, time]]
    
    # 2. Scale features (same as training)
    features_scaled = scaler.transform(features)
    
    # 3. Get prediction (-1 = anomaly, 1 = normal)
    prediction = model.predict(features_scaled)[0]
    
    # 4. Get anomaly score (more negative = more anomalous)
    anomaly_score = model.score_samples(features_scaled)[0]
    
    # 5. Convert to risk score (positive, higher = riskier)
    risk_score = -anomaly_score
    
    # 6. Return classification and score
    return {
        "prediction": "FRAUD" if prediction == -1 else "NORMAL",
        "risk_score": round(risk_score, 4)
    }
```

#### Model Persistence

**Artifacts Saved**:
- `model.pkl` — Trained IsolationForest model
- `scaler.pkl` — StandardScaler with training data statistics

**Why Save Both?**
- Scaler must use exact same mean/std as training
- Ensures consistent feature transformation
- Prevents "data leakage" between train and predict

### Example Predictions

| Amount | Time | Prediction | Risk Score | Reasoning |
|--------|------|------------|------------|-----------|
| $100 | 14:00 | NORMAL | 0.23 | Small amount during business hours |
| $70,000 | 2:00 | **FRAUD** | 2.87 | Very large amount at 2 AM |
| $9,000 | 2:00 | **FRAUD** | 1.94 | Large amount during high-risk hours |
| $250 | 22:00 | NORMAL | 0.45 | Medium amount, slightly late |

### Model Training Script

```bash
cd backend
python ml/train.py
```

**Output**:
```
Model trained successfully
  model.pkl  → backend/ml/model.pkl
  scaler.pkl → backend/ml/scaler.pkl
```

### Fraud Reasoning Logic

The UI provides **human-readable explanations** for fraud classifications:

**Time-Based Indicators**:
- Transaction outside normal hours (6 AM - 10 PM)
- Transaction during high-risk window (2 AM - 4 AM)

**Amount-Based Indicators**:
- Large amount anomaly (> $50,000)
- Unusually small transaction (< $100)

**Risk Score Indicators**:
- Extremely high deviation (score > 0.8)
- Significant deviation (score > 0.6)

These are **derived from the ML score** and **transaction features**, not hardcoded rules.

---

## 🚀 Quick Start

### Prerequisites

**Backend**:
- Python 3.13 (or 3.9+)
- pip package manager

**Frontend**:
- Node.js 18+ (or 16+)
- npm package manager

**Firebase** (Optional for auth features):
- Firebase project with Authentication and Firestore enabled
- Google Sign-In provider configured

### Installation

#### 1. Clone Repository

```bash
git clone <your-repo-url>
cd FinGuard-AI
```

#### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Train ML model
python ml/train.py

# Start FastAPI server
uvicorn app.main:app --port 8000
```

Backend will run at: **http://localhost:8000**

#### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
# Copy .env.local.example to .env.local (if provided)
# OR create .env.local with Firebase config:
```

**.env.local** (required for authentication):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

```bash
# Start development server
npm run dev
```

Frontend will run at: **http://localhost:3000**

### Firebase Configuration

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project
   - Copy configuration credentials

2. **Enable Google Sign-In**:
   - Navigate to Authentication > Sign-in method
   - Enable "Google" provider
   - Save changes

3. **Enable Firestore**:
   - Navigate to Firestore Database
   - Create database
   - Start in **test mode** (or configure security rules)

### Verify Installation

1. **Backend Health Check**:
   ```bash
   curl http://localhost:8000
   # Should return: {"status": "Backend running"}
   ```

2. **Frontend Access**:
   - Open browser to http://localhost:3000
   - Should see FinGuard AI login page

3. **ML Model Test**:
   ```bash
   cd backend
   python -c "from ml.predict import predict_fraud; print(predict_fraud(70000, 2))"
   # Should return: {'prediction': 'FRAUD', 'risk_score': 2.87}
   ```

---

## 📁 Project Structure

```
FinGuard-AI/
│
├── backend/                      # Python FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application & endpoints
│   │   ├── api/                 # API route handlers
│   │   ├── core/                # Core configurations
│   │   ├── db/
│   │   │   ├── session.py       # SQLAlchemy database setup
│   │   │   └── __init__.py
│   │   ├── models/
│   │   │   ├── transaction.py   # SQLAlchemy Transaction model
│   │   │   └── __init__.py
│   │   ├── schemas/
│   │   │   ├── transaction.py   # Pydantic schemas for validation
│   │   │   └── __init__.py
│   │   └── services/
│   │       ├── transaction.py   # Business logic for transactions
│   │       ├── simulator.py     # Transaction simulator
│   │       └── __init__.py
│   │
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── train.py             # Model training script
│   │   ├── predict.py           # Fraud prediction function
│   │   ├── model.pkl            # Trained IsolationForest model
│   │   └── scaler.pkl           # StandardScaler for features
│   │
│   └── requirements.txt         # Python dependencies
│
├── frontend/                     # Next.js TypeScript Frontend
│   ├── app/
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Home page
│   │   ├── globals.css          # Global styles + theme CSS variables
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Analytics dashboard
│   │   ├── detect/
│   │   │   └── page.tsx         # Fraud detection page
│   │   └── login/
│   │       └── page.tsx         # Google Sign-In page
│   │
│   ├── components/
│   │   ├── Navbar.tsx           # Navigation with theme toggle
│   │   ├── StatusBadge.tsx      # Transaction status indicator
│   │   ├── BlockButton.tsx      # Block transaction button
│   │   └── TransactionDetailsModal.tsx  # Fraud analysis modal
│   │
│   ├── context/
│   │   ├── AuthContext.tsx      # Firebase authentication context
│   │   └── ThemeContext.tsx     # Dark/light mode context
│   │
│   ├── lib/
│   │   └── firebase.ts          # Firebase initialization
│   │
│   ├── services/
│   │   └── api.ts               # Axios API client
│   │
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   │
│   ├── utils/
│   │   ├── currency.ts          # Currency formatting utilities
│   │   └── risk.ts              # Risk score utilities
│   │
│   ├── .env.local               # Firebase configuration (gitignored)
│   ├── package.json             # Node dependencies
│   ├── tsconfig.json            # TypeScript configuration
│   ├── tailwind.config.ts       # Tailwind CSS configuration
│   └── next.config.ts           # Next.js configuration
│
├── PROJECT_OVERVIEW.txt         # Detailed project documentation
└── README.md                    # This file
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Health Check

**GET** `/`

Check if backend is running.

**Response**:
```json
{
  "status": "Backend running"
}
```

---

#### 2. Predict Fraud

**POST** `/predict`

Analyze a transaction and return fraud prediction.

**Request Body**:
```json
{
  "amount": 9000.0,
  "time": 2.0
}
```

**Parameters**:
- `amount` (float, required): Transaction amount in USD (> 0)
- `time` (float, required): Hour of day (0-23)

**Response**:
```json
{
  "prediction": "FRAUD",
  "risk_score": 1.9432
}
```

**Response Fields**:
- `prediction` (string): Either "FRAUD" or "NORMAL"
- `risk_score` (float): Anomaly score (higher = more suspicious)

**Example**:
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"amount": 70000, "time": 2}'
```

---

#### 3. Get Transactions

**GET** `/transactions`

Retrieve all stored transactions, most recent first.

**Response**:
```json
[
  {
    "id": 42,
    "amount": 9000.0,
    "time": 2.0,
    "prediction": "FRAUD",
    "risk_score": 1.9432,
    "status": "ACTIVE",
    "created_at": "2026-02-21T14:30:00"
  },
  ...
]
```

**Response Fields**:
- `id` (int): Unique transaction identifier
- `amount` (float): Transaction amount
- `time` (float): Hour of day
- `prediction` (string): ML classification
- `risk_score` (float): Anomaly score
- `status` (string): "ACTIVE" or "BLOCKED"
- `created_at` (datetime): Timestamp of creation

**Example**:
```bash
curl http://localhost:8000/transactions
```

---

#### 4. Block Transaction

**PATCH** `/transactions/{transaction_id}/block`

Block a fraudulent transaction by ID.

**Path Parameters**:
- `transaction_id` (int): ID of transaction to block

**Response**:
```json
{
  "id": 42,
  "amount": 9000.0,
  "time": 2.0,
  "prediction": "FRAUD",
  "risk_score": 1.9432,
  "status": "BLOCKED",
  "created_at": "2026-02-21T14:30:00"
}
```

**Error Response** (404):
```json
{
  "detail": "Transaction 42 not found"
}
```

**Example**:
```bash
curl -X PATCH http://localhost:8000/transactions/42/block
```

---

#### 5. Start Simulator

**POST** `/simulator/start`

Start automated transaction generation.

**Response**:
```json
{
  "status": "started"
}
```

---

#### 6. Stop Simulator

**POST** `/simulator/stop`

Stop automated transaction generation.

**Response**:
```json
{
  "status": "stopped"
}
```

---

### CORS Configuration

All endpoints support **CORS** with:
- `allow_origins`: `["*"]` (all origins allowed)
- `allow_methods`: `["*"]` (all HTTP methods)
- `allow_headers`: `["*"]` (all headers)

**Production Note**: Restrict origins in production deployment.

---

## 🎨 Frontend Features

### Pages

#### 1. Login Page (`/login`)
- Google Sign-In button with logo
- Firebase OAuth authentication
- Auto-redirect to dashboard after login
- Error handling for auth failures

#### 2. Home Page (`/`)
- Platform overview
- Feature highlights
- System status indicators
- Call-to-action buttons

#### 3. Detect Fraud Page (`/detect`)
- **Transaction Input Form**:
  - Amount input with USD formatting
  - Time slider (0-23 hours)
  - Submit button with loading state
- **Prediction Result**:
  - FRAUD/NORMAL badge
  - Risk score percentage
  - Color-coded severity indicator
- **Transaction History Table**:
  - All past predictions
  - Sortable columns
  - View Details buttons
  - Visual fraud highlighting

#### 4. Dashboard Page (`/dashboard`)
- **KPI Cards** (4 metrics):
  - Total Transactions
  - Fraud Count
  - Fraud Rate %
  - Latest Risk Score
- **Charts**:
  - Bar chart (Fraud vs Normal)
  - Donut chart (distribution %)
- **Recent Transactions** (5 latest)
- **Auto-Refresh** every 5 seconds
- **Skeleton Loaders** during fetches

### Components

#### Navbar
- FinGuard AI branding logo
- Navigation links (Dashboard, Detect)
- Theme toggle button (🌙/☀️)
- User profile display
- Logout button

#### TransactionDetailsModal
- **4-Section Layout**:
  1. Transaction Information
  2. Account Flow (visual)
  3. AI Risk Analysis
  4. Fraud Indicators
- **Actions**:
  - Download PDF Report button
  - Close button
  - Block Transaction button (conditional)
  - Mark as Safe button (conditional)
- **Styling**:
  - Backdrop blur overlay
  - Sticky header/footer
  - Scrollable content area
  - Responsive design

#### StatusBadge
- Color-coded transaction status
- ACTIVE (green) vs BLOCKED (red)
- Icon indicators

#### BlockButton
- Disabled for blocked transactions
- Loading state during API call
- Error handling
- Success confirmation

### Contexts

#### AuthContext
- Firebase authentication state
- User profile management
- `loginWithGoogle()` function
- `logout()` function
- Auto-create Firestore user documents

#### ThemeContext
- `theme` state ("dark" or "light")
- `toggleTheme()` function
- localStorage persistence
- Document class manipulation

### Utilities

#### Currency Formatting
```typescript
formatCurrency(9000) // "₹9,000.00"
```

#### Risk Score Formatting
```typescript
formatRiskPercentage(1.9432) // "194%"
riskTextColorClass(1.9432)    // "text-red-500"
```

### Styling Approach

**Tailwind CSS** with:
- Utility-first classes
- Custom CSS variables for theming
- Responsive breakpoints
- Dark/light variants
- Animation utilities

**Theme Variables** (`globals.css`):
```css
:root {
  --bg-base: #0f172a;
  --text-primary: #ffffff;
  /* ... */
}

html.light {
  --bg-base: #ffffff;
  --text-primary: #0f172a;
  /* ... */
}
```

---

## 🔨 How We Built It

### Phase 1: ML Model Development

**Goal**: Create accurate fraud detection algorithm

**Process**:
1. **Algorithm Selection**
   - Researched anomaly detection methods
   - Chose IsolationForest for unsupervised learning
   - Ideal for rare, distinct anomalies (fraud)

2. **Data Generation**
   - Created synthetic transaction dataset
   - 1000 normal + 50 fraud samples
   - Features: amount, time-of-day

3. **Model Training**
   - Used scikit-learn's IsolationForest
   - Set contamination parameter to 2%
   - Applied StandardScaler for normalization
   - Saved model and scaler with joblib

4. **Prediction Function**
   - Loaded pre-trained model artifacts
   - Transformed input features
   - Returned prediction + risk score
   - Optimized for real-time inference

**Key Decisions**:
- ✅ Unsupervised learning (no fraud labels needed)
- ✅ Simple feature set (amount + time)
- ✅ Fast predictions (< 100ms)

---

### Phase 2: Backend API Development

**Goal**: Create robust REST API for ML model

**Process**:
1. **Framework Setup**
   - Chose FastAPI for async performance
   - Added Pydantic for data validation
   - Configured CORS for frontend access

2. **Database Layer**
   - SQLAlchemy ORM for database abstraction
   - SQLite for development simplicity
   - Transaction model with risk scores
   - Migration logic for schema updates

3. **API Endpoints**
   - POST /predict — ML inference + DB storage
   - GET /transactions — Retrieve history
   - PATCH /block — Update transaction status
   - Simulator endpoints for testing

4. **Service Layer**
   - Separated business logic from routes
   - transaction.py for CRUD operations
   - simulator.py for automated testing

**Key Decisions**:
- ✅ FastAPI for modern Python web framework
- ✅ SQLite for portable database
- ✅ Pydantic for automatic validation
- ✅ Async endpoints for scalability

---

### Phase 3: Frontend Foundation

**Goal**: Build modern React interface

**Process**:
1. **Next.js Setup**
   - Chose Next.js 16 with App Router
   - TypeScript for type safety
   - Tailwind CSS for rapid styling

2. **API Integration**
   - Created Axios client in services/api.ts
   - Type-safe API calls with TypeScript
   - Error handling and loading states

3. **Core Pages**
   - Home page with platform overview
   - Detect page with form + results
   - Dashboard with live analytics

4. **Chart Integration**
   - Recharts library for visualizations
   - Bar chart for fraud comparison
   - Donut chart for distribution
   - Responsive chart sizing

**Key Decisions**:
- ✅ Next.js for React + server features
- ✅ TypeScript for fewer bugs
- ✅ Tailwind for consistent design
- ✅ Recharts for professional charts

---

### Phase 4: Real-Time Features

**Goal**: Live dashboard with auto-refresh

**Process**:
1. **Polling Mechanism**
   - setInterval for 5-second polling
   - Fetch latest transactions from API
   - Update state without page reload

2. **Animated Updates**
   - Flash effect on new fraud detections
   - Number animations on KPI changes
   - Smooth transitions for UX

3. **Transaction Simulator**
   - Backend service generating random transactions
   - Start/Stop controls in UI
   - Test dashboard live updates

**Key Decisions**:
- ✅ Polling over WebSockets (simpler)
- ✅ 5-second interval (balance speed/load)
- ✅ Visual feedback for updates

---

### Phase 5: Authentication System

**Goal**: Secure user access with Google Sign-In

**Process**:
1. **Firebase Setup**
   - Created Firebase project
   - Enabled Authentication + Firestore
   - Configured Google Sign-In provider

2. **Frontend Integration**
   - Firebase SDK v12
   - Created AuthContext for state
   - Login page with Google OAuth
   - Protected routes with auth checks

3. **User Management**
   - Auto-create Firestore user documents
   - Store name, email, role, timestamp
   - Session persistence across refreshes

**Key Decisions**:
- ✅ Firebase for managed auth (no backend auth code)
- ✅ Google-only sign-in (simplified UX)
- ✅ Firestore for user profiles
- ✅ Context API for global auth state

---

### Phase 6: UI/UX Enhancements

**Goal**: Professional fintech aesthetic

**Process**:
1. **Dark/Light Mode**
   - Created ThemeContext
   - localStorage for persistence
   - CSS variables for dynamic theming
   - Toggle button in navbar

2. **Design System**
   - Color palette (slate blues, accents)
   - Typography hierarchy
   - Spacing scale
   - Component patterns

3. **Micro-Interactions**
   - Hover effects on buttons
   - Loading spinners
   - Skeleton loaders
   - Smooth transitions (300ms)

4. **Responsive Design**
   - Mobile-first approach
   - Breakpoints (sm, md, lg, xl)
   - Flexible grids
   - Adaptive components

**Key Decisions**:
- ✅ Dark mode as default (fintech standard)
- ✅ CSS variables for theming
- ✅ Consistent spacing/colors
- ✅ Accessibility considerations

---

### Phase 7: Transaction Details Modal

**Goal**: Professional fraud investigation interface

**Process**:
1. **Modal Component**
   - Fixed positioning with backdrop blur
   - Sticky header and footer
   - Scrollable content area
   - Click-outside to close

2. **4-Section Layout**
   - Transaction Info (ID, amount, date, status)
   - Account Flow (visual sender → recipient)
   - AI Risk Analysis (score, prediction, level)
   - Fraud Indicators (detailed reasoning)

3. **Fraud Reasoning**
   - Algorithm to explain AI decision
   - Time-based anomalies
   - Amount-based anomalies
   - Risk score interpretation

4. **Action Buttons**
   - Block Transaction (for fraud, if active)
   - Mark as Safe (for normal predictions)
   - Close modal

**Key Decisions**:
- ✅ Modal over separate page (faster workflow)
- ✅ 4 sections for comprehensive analysis
- ✅ AI reasoning for transparency
- ✅ Conditional actions based on state

---

### Phase 8: PDF Report Generation

**Goal**: Downloadable fraud investigation reports

**Process**:
1. **Library Selection**
   - Evaluated jsPDF vs pdfmake
   - Chose jsPDF for simplicity
   - Added html2canvas for advanced layouts

2. **PDF Generation Function**
   - Client-side PDF creation
   - Professional report layout
   - FinGuard AI branding
   - All transaction details + AI analysis

3. **Button Integration**
   - Added to modal footer
   - Loading state during generation
   - Auto-download with dynamic filename
   - `fraud_report_<id>.pdf` naming

4. **Content Sections**
   - Header with title
   - Transaction Information
   - Account Flow
   - AI Risk Analysis
   - Fraud Indicators (if applicable)
   - Footer with timestamp

**Key Decisions**:
- ✅ Client-side generation (no server load)
- ✅ jsPDF for lightweight solution
- ✅ Professional layout with branding
- ✅ One-click download UX

---

### Development Workflow

**Tools**:
- VS Code as IDE
- PowerShell for terminal
- Git for version control
- npm/pip for dependencies

**Process**:
1. Feature planning
2. Backend API development
3. Frontend UI implementation
4. Integration testing
5. Refinement based on feedback

**Best Practices**:
- Type safety with TypeScript and Pydantic
- Component reusability
- Separation of concerns (services, models, components)
- Error handling at every layer
- Loading states for async operations

---

## 📸 Screenshots

### Dashboard
![Dashboard](docs/dashboard.png)
*Real-time analytics with KPIs, charts, and recent transactions*

### Fraud Detection
![Detect Page](docs/detect.png)
*Transaction input form with instant ML predictions*

### Transaction Details Modal
![Transaction Modal](docs/modal.png)
*Comprehensive fraud analysis with 4 detailed sections*

### Dark/Light Mode
![Theme Toggle](docs/theme.png)
*Seamless theme switching with persistent preferences*

---

## 🚀 Future Roadmap

### Short-Term (v1.1)

- [ ] **Enhanced ML Model**
  - Add more features (merchant, location, device)
  - Train on real fraud datasets
  - Support multiple ML algorithms
  - Model A/B testing

- [ ] **Advanced Analytics**
  - Time-series fraud trends
  - Merchant risk profiling
  - Customer behavior analysis
  - Predictive fraud forecasting

- [ ] **Notifications**
  - Email alerts for high-risk transactions
  - SMS notifications for blocked transactions
  - In-app notification center
  - Webhook integrations

### Mid-Term (v1.5)

- [ ] **Multi-User Support**
  - Role-based access control (Admin, Analyst, Viewer)
  - Team collaboration features
  - Audit logs
  - User activity tracking

- [ ] **Transaction Review Workflow**
  - Review queue for flagged transactions
  - Analyst notes and comments
  - Multi-level approval process
  - Case management system

- [ ] **Integration APIs**
  - REST API for third-party integrations
  - Webhooks for real-time events
  - SDK for JavaScript/Python
  - Plugin architecture

### Long-Term (v2.0)

- [ ] **Production Database**
  - Migrate from SQLite to PostgreSQL
  - Database clustering and replication
  - Backup and disaster recovery
  - Performance optimization

- [ ] **Microservices Architecture**
  - Separate ML service
  - Authentication service
  - Notification service
  - API gateway

- [ ] **Advanced Features**
  - Network graph analysis (detect fraud rings)
  - Behavioral biometrics
  - Geolocation tracking
  - Device fingerprinting

- [ ] **Enterprise Features**
  - White-label customization
  - Multi-tenancy support
  - SLA monitoring
  - 24/7 support dashboard

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👥 Contributors

**FinGuard AI Team** — February 2026

---

## 📞 Support

For questions, issues, or feedback:

- **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)
- **Email**: support@finguard.ai
- **Documentation**: See `PROJECT_OVERVIEW.txt` for detailed specs

---

## 🙏 Acknowledgments

- **scikit-learn** — For the powerful IsolationForest algorithm
- **FastAPI** — For the modern, fast web framework
- **Next.js** — For the excellent React framework
- **Firebase** — For hassle-free authentication
- **Recharts** — For beautiful, responsive charts
- **Tailwind CSS** — For rapid UI development

---

<div align="center">

**Built with ❤️ by the FinGuard AI Team**

*Protecting finances, one transaction at a time* 🛡️

</div>
