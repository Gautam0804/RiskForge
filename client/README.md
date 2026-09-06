# RiskForge

## Real-Time AI Fraud Detection & Risk Intelligence Platform

RiskForge is a production-oriented fraud detection and risk intelligence platform designed to detect suspicious financial transactions, calculate transaction risk, provide real-time fraud alerts, and assist fraud analysts with AI-powered investigation workflows.

The platform combines:

- Full-stack web development
- Rule-based risk detection
- Machine learning
- Real-time event processing
- Redis-based caching
- PostgreSQL
- AI/RAG-powered investigation
- Secure REST APIs
- Role-based access control
- Production deployment

The goal of RiskForge is to simulate how a modern financial fraud detection platform could be designed and deployed in a real-world engineering environment.

---

# 🚀 Live Demo

> Deployment is currently being finalized.

| Service | Status |
|---|---|
| Frontend | 🚧 Deployment |
| Backend API | 🚧 Deployment |
| ML Service | 🚧 Deployment |
| PostgreSQL | 🚧 Production setup |
| Redis | 🚧 Production setup |

---

# 🎯 Problem Statement

Financial platforms process thousands or millions of transactions every day.

Traditional systems often rely on static rules such as:

```text
IF transaction_amount > threshold
THEN flag transaction

While useful, rule-only systems can generate:

False positives
False negatives
Poor adaptability
Limited contextual intelligence
Slow investigation workflows

RiskForge addresses this problem by combining multiple layers of risk intelligence.

Transaction
     │
     ▼
Validation
     │
     ▼
Rule-Based Risk Engine
     │
     ▼
ML Fraud Prediction
     │
     ▼
Risk Aggregation
     │
     ▼
Risk Score
     │
 ┌───┼─────────────┐
 ▼   ▼             ▼
LOW MEDIUM       HIGH/CRITICAL
 │   │             │
 ▼   ▼             ▼
Approve Review    Alert
                    │
                    ▼
              Investigation
                    │
                    ▼
               AI Assistant
✨ Key Features
1. Transaction Risk Detection

Every transaction can be evaluated against multiple risk indicators.

Current risk signals include:

Transaction amount anomaly
New device detection
Transaction velocity
Location anomaly
Risk score
Risk level
Recommended transaction status

Example:

Transaction Amount: ₹75,000
Device: NEW-DEVICE-92

Risk Score: 55
Risk Level: MEDIUM
Status: APPROVED
2. Risk Scoring Engine

RiskForge currently uses a configurable rule-based scoring engine.

Example scoring:

Risk Factor	Score
Amount ≥ ₹50,000	+30
Amount ≥ ₹20,000	+15
New Device	+25
High Transaction Velocity	+25
Location Anomaly	+20

The final score is capped at:

100

Risk levels:

Score	Risk Level
0 - 34	LOW
35 - 64	MEDIUM
65 - 84	HIGH
85 - 100	CRITICAL

Transaction decisions:

Risk Score	Decision
< 65	APPROVED
65 - 84	REVIEW
≥ 85	BLOCKED
3. Fraud Alerts

High-risk transactions can automatically generate fraud alerts.

Alerts contain information such as:

Transaction ID
Risk score
Risk level
Transaction amount
Alert status
Creation timestamp

The alert system is designed to support real-time fraud monitoring.

4. Fraud Investigation Workflow

Fraud analysts can investigate suspicious transactions using:

Transaction information
Risk score
Risk factors
Device information
Location information
Transaction history
AI investigation assistance

Future investigation actions include:

Approve
Review
Block
Mark as Fraud
Dismiss Alert
5. AI Investigator

RiskForge is designed to include an AI-powered investigation assistant.

The AI Investigator will allow analysts to ask natural-language questions such as:

Why was this transaction flagged?
What are the strongest risk indicators?
Show me similar suspicious transactions.
Why does this transaction look different from the user's normal behavior?
Summarize this investigation.

The planned AI layer combines:

Transaction Data
       +
Risk Signals
       +
Historical Data
       +
Knowledge Base
       ↓
      RAG
       ↓
      LLM
       ↓
Investigation Explanation
6. Real-Time Fraud Monitoring

RiskForge is designed around real-time fraud monitoring.

Planned architecture:

Transaction Event
       │
       ▼
Risk Engine
       │
       ▼
High-Risk Transaction
       │
       ▼
Redis Event Layer
       │
       ▼
Socket.IO
       │
       ▼
Fraud Dashboard
       │
       ▼
Real-Time Alert

This allows analysts to see important fraud events without manually refreshing the dashboard.

7. Analytics Dashboard

The dashboard is designed to provide fraud intelligence through:

Total transactions
Suspicious transactions
High-risk transactions
Confirmed fraud
Average risk score
Risk distribution
Transaction volume
Fraud rate
Fraud trends
Geographic patterns
Merchant patterns
Device patterns
🖥️ Application Pages

RiskForge contains the following major sections:

RiskForge
│
├── Dashboard
│
├── Transactions
│
├── Alerts
│
├── Investigations
│
├── AI Investigator
│
├── Analytics
│
└── Settings
    ├── Users
    ├── Fraud Rules
    ├── Notifications
    └── Audit Logs
🏗️ System Architecture
                         ┌──────────────────────┐
                         │      React App       │
                         │       Vercel         │
                         └──────────┬───────────┘
                                    │
                              HTTPS / REST
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Node + Express     │
                         │      API Server      │
                         └───────┬───────┬──────┘
                                 │       │
                       ┌─────────┘       └─────────┐
                       ▼                           ▼
              ┌────────────────┐          ┌────────────────┐
              │   PostgreSQL   │          │     Redis      │
              │ Transactions   │          │ Cache / Events │
              │ Users / Alerts│          │ Real-time Data │
              └────────────────┘          └───────┬────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │    Socket.IO    │
                                         │ Real-time Alert │
                                         └────────┬────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │ React Dashboard │
                                         └─────────────────┘

                         Node API
                            │
                            │ HTTP
                            ▼
                  ┌────────────────────┐
                  │ Python FastAPI     │
                  │ ML Inference       │
                  │ XGBoost            │
                  └─────────┬──────────┘
                            │
                            ▼
                    Fraud Probability
                         0.00 - 1.00
                            │
                            ▼
                 ┌─────────────────────┐
                 │    Risk Engine      │
                 │ Rules + ML + Context│
                 └──────────┬──────────┘
                            │
                  ┌─────────┼─────────┐
                  ▼         ▼         ▼
               APPROVE    REVIEW     BLOCK
🧰 Technology Stack
Frontend
React
JavaScript
Vite
React Router
Axios
Recharts
Lucide React
Backend
Node.js
Express.js
REST API
JWT Authentication
bcrypt
Zod
Helmet
CORS
Morgan
Express Rate Limit
Database
PostgreSQL
SQL migrations
Connection pooling
Cache & Real-Time
Redis / Redis-compatible Valkey
Socket.IO
Machine Learning
Python
FastAPI
XGBoost
Pandas
NumPy
Scikit-learn
Joblib
AI

Planned:

Retrieval-Augmented Generation
Embeddings
Vector database
LLM
Investigation assistant
Deployment
Vercel
Render
Docker
GitHub
Managed PostgreSQL
Managed Redis/Valkey
📁 Project Structure
RiskForge/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── transactions/
│   │   │   ├── alerts/
│   │   │   ├── investigations/
│   │   │   ├── ai/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── transactions/
│   │   │   ├── alerts/
│   │   │   ├── investigations/
│   │   │   ├── ai/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   │
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   └── constants/
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── db/
│   │       └── migrations/
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── ml-service/
│   ├── app/
│   ├── data/
│   ├── models/
│   ├── training/
│   ├── main.py
│   └── requirements.txt
│
├── docker/
│   └── docker-compose.yml
│
├── docs/
│
├── .gitignore
└── README.md
🔐 Authentication & Authorization

RiskForge uses JWT-based authentication.

Authentication flow:

User
 │
 ▼
Login
 │
 ▼
POST /api/auth/login
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT
 │
 ▼
Return Token
 │
 ▼
Frontend
 │
 ▼
Authorization Header
 │
 ▼
Protected API

Example:

Authorization: Bearer <JWT_TOKEN>

The platform is designed to support role-based access control.

Planned roles:

ADMIN
ANALYST
VIEWER
🛡️ Security

Security is treated as a first-class part of the platform.

Current security measures include:

JWT authentication
Password hashing using bcrypt
HTTP security headers with Helmet
Request validation using Zod
API rate limiting
CORS configuration
Environment-based secrets
PostgreSQL parameterized queries
Disabled Express x-powered-by
Request body size limits
Centralized error handling

Production security goals include:

Secret rotation
Refresh token strategy
Audit logging
API key management
Role-based permissions
Input sanitization
Security monitoring
HTTPS-only communication
Database backup strategy
🗄️ Database Design

Core entities include:

users
transactions
alerts
investigations
audit_logs

Relationship overview:

User
 │
 ├───────────────┐
 │               │
 ▼               ▼
Transactions    Audit Logs
 │
 ├───────────────┐
 │               │
 ▼               ▼
Alerts       Investigations
🔌 API
Health Check
GET /api/health

Example response:

{
  "success": true,
  "service": "RiskForge API",
  "status": "healthy",
  "environment": "development",
  "timestamp": "2026-09-06T00:00:00.000Z"
}
Authentication API
Login
POST /api/auth/login

Request:

{
  "email": "admin@riskforge.com",
  "password": "RiskForge@123"
}

Response:

{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {},
    "token": "<JWT>"
  }
}
Transaction API
Create Transaction
POST /api/transactions

Example:

{
  "merchant": "Amazon",
  "amount": 75000,
  "currency": "INR",
  "deviceId": "NEW-DEVICE-92",
  "locationCity": "Mumbai",
  "transactionType": "purchase"
}
Get Transactions
GET /api/transactions
Get Transaction
GET /api/transactions/:transactionId
Alert API
Get Alerts
GET /api/alerts

Alerts are generated for transactions crossing the configured high-risk threshold.

Dashboard API
Get Dashboard Overview
GET /api/dashboard

Example response structure:

{
  "success": true,
  "data": {
    "overview": {
      "total_transactions": 120,
      "suspicious_transactions": 27,
      "high_risk_transactions": 12,
      "confirmed_fraud": 5,
      "average_risk_score": 38.42
    },
    "riskDistribution": []
  }
}
🤖 Machine Learning Architecture

The ML service is separated from the Node.js API.

React
 │
 ▼
Node.js API
 │
 ▼
Python FastAPI
 │
 ▼
Feature Engineering
 │
 ▼
XGBoost Model
 │
 ▼
Fraud Probability
 │
 ▼
Risk Aggregation

Example:

Input Features
    │
    ├── amount
    ├── transaction velocity
    ├── device information
    ├── location
    ├── transaction type
    ├── historical behavior
    └── user risk signals
           │
           ▼
      XGBoost Model
           │
           ▼
 Fraud Probability
     0.00 - 1.00
📊 ML Evaluation

The production ML pipeline will track:

Precision
Recall
F1 Score
ROC-AUC
Confusion Matrix
False Positive Rate
False Negative Rate
Model latency

For fraud detection, model evaluation will prioritize recall and precision, rather than relying only on raw accuracy because fraud datasets are usually highly imbalanced.

⚡ Real-Time Architecture

Real-time event flow:

Transaction Created
        │
        ▼
Risk Evaluation
        │
        ▼
High Risk?
    ┌───┴───┐
   NO      YES
    │        │
    ▼        ▼
 Continue   Create Alert
              │
              ▼
          Redis Event
              │
              ▼
          Socket.IO
              │
              ▼
       Analyst Dashboard
🧠 AI Investigation Architecture

Planned RAG architecture:

                    ┌──────────────────┐
                    │ Analyst Question │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Query Processing │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Vector Retrieval │
                    └────────┬─────────┘
                             │
                    Relevant Context
                             │
                             ▼
                    ┌──────────────────┐
                    │      LLM         │
                    └────────┬─────────┘
                             │
                             ▼
                    Investigation Answer

The AI system will be designed to ground responses in available transaction and investigation data instead of relying purely on model-generated assumptions.

🐳 Local Development
Prerequisites

Install:

Node.js 20+
npm
Python 3.11+
Docker Desktop
Git
PostgreSQL client
Redis-compatible service

Verify:

node --version
npm --version
python --version
docker --version
docker compose version
git --version
⚙️ Installation

Clone the repository:

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd RiskForge
Frontend Setup
cd client
npm install
npm run dev

Frontend:

http://localhost:5173
Backend Setup
cd server
npm install

Create:

server/.env

Example:

PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://riskforge:riskforge_dev_password@localhost:5433/riskforge

REDIS_URL=redis://localhost:6379

JWT_SECRET=replace_with_a_long_random_secret_at_least_32_characters
JWT_EXPIRES_IN=1d

CORS_ORIGINS=http://localhost:5173

ML_SERVICE_URL=http://localhost:8000

Start the backend:

npm run dev

Backend:

http://localhost:5000

Health check:

http://localhost:5000/api/health
🐘 PostgreSQL + Redis

Start infrastructure:

cd docker
docker compose up -d

Check containers:

docker ps

Expected services:

riskforge-postgres
riskforge-redis

PostgreSQL:

localhost:5433

Redis:

localhost:6379
🗃️ Database Migration

Run the initial migration:

Get-Content "server/src/db/migrations/001_initial.sql" | docker exec -i riskforge-postgres psql -U riskforge -d riskforge

Verify tables:

docker exec -it riskforge-postgres psql -U riskforge -d riskforge

Then:

\dt

Expected tables:

alerts
audit_logs
investigations
transactions
users
🌱 Database Seed

From the server directory:

npm run seed

Development admin credentials:

Email:
admin@riskforge.com

Password:
RiskForge@123

Do not use these credentials in production.

🐍 ML Service Setup
cd ml-service
python -m venv .venv

Activate on Windows PowerShell:

.\.venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Run:

uvicorn main:app --reload --port 8000

ML health check:

http://localhost:8000/health
🧪 Testing

Backend health:

curl http://localhost:5000/api/health

ML health:

curl http://localhost:8000/health

Frontend:

http://localhost:5173

Authentication:

POST /api/auth/login

Transaction:

POST /api/transactions

Dashboard:

GET /api/dashboard
🚀 Production Deployment

RiskForge is designed for independent service deployment.

GitHub
  │
  ├──────────────► Vercel
  │                  │
  │                  ▼
  │              React App
  │
  ├──────────────► Render
  │                  │
  │                  ▼
  │              Node API
  │
  └──────────────► Render
                     │
                     ▼
                 ML Service

Render
 │
 ├── PostgreSQL
 │
 └── Redis / Valkey
🌍 Deployment Environment Variables
Backend

Production backend requires:

NODE_ENV=production

DATABASE_URL=<MANAGED_POSTGRES_URL>

REDIS_URL=<MANAGED_REDIS_URL>

JWT_SECRET=<STRONG_RANDOM_SECRET>

JWT_EXPIRES_IN=1d

CORS_ORIGINS=<VERCEL_FRONTEND_URL>

ML_SERVICE_URL=<ML_SERVICE_URL>
Frontend

Vercel environment variable:

VITE_API_URL=https://<RISKFORGE-API>/api

Build command:

npm run build

Output directory:

dist
ML Service

Production command:

uvicorn main:app --host 0.0.0.0 --port $PORT

Health endpoint:

/health
🔄 CI/CD

The production deployment is designed around Git-based deployment.

Developer
    │
    ▼
Git Commit
    │
    ▼
GitHub
    │
    ├───────────────┐
    ▼               ▼
 Vercel           Render
    │               │
    ▼               ├── Node API
Frontend            ├── ML Service
                    ├── PostgreSQL
                    └── Redis

Future CI/CD improvements:

Automated tests
ESLint
Security checks
Build validation
Docker image validation
Deployment gates
Automated migrations
📈 Observability

Production observability will include:

API health checks
Structured logs
Request logging
Error tracking
Database monitoring
ML inference latency
Fraud detection metrics
Real-time event monitoring

Future integrations may include:

Sentry
OpenTelemetry
Prometheus
Grafana
🧪 Development Roadmap

RiskForge is being developed incrementally toward production readiness.

Phase 1 — Foundation
 React frontend
 Node.js backend
 Express API
 PostgreSQL
 Redis
 Docker infrastructure
 Environment configuration
 Database migrations
 Database seed
 Health checks
Phase 2 — Authentication
 JWT authentication
 Password hashing
 Protected routes
 Request validation
 API rate limiting
 Advanced RBAC
 Refresh tokens
 Session management
Phase 3 — Fraud Engine
 Transaction API
 Risk scoring
 Risk levels
 Risk factors
 Automatic alert generation
 Configurable fraud rules
 Historical behavior analysis
 Merchant risk profiles
 Device fingerprinting
Phase 4 — Machine Learning
 FastAPI ML service foundation
 XGBoost dependency
 Dataset pipeline
 Feature engineering
 Model training
 Model evaluation
 Model versioning
 Production inference
 Model monitoring
Phase 5 — Real-Time System
 Redis event architecture
 Socket.IO integration
 Live fraud alerts
 Real-time dashboard updates
 Event retry handling
 Idempotency
Phase 6 — AI Investigator
 RAG pipeline
 Embedding generation
 Vector storage
 LLM integration
 Investigation assistant
 Evidence-grounded responses
 Investigation summaries
Phase 7 — Production Hardening
 Automated tests
 Integration tests
 API documentation
 Docker production images
 CI/CD
 Monitoring
 Error tracking
 Security audit
 Performance optimization
 Production documentation
📊 Engineering Goals

RiskForge is being built with production engineering principles rather than only feature development.

Key goals:

Reliability
Graceful error handling
Database connection pooling
Health checks
Retry strategies
Idempotent operations
Security
Secure authentication
Authorization
Input validation
Rate limiting
Secret management
Audit logs
Scalability
Stateless API architecture
Redis caching
Horizontal backend scaling
Independent ML service
Database indexing
Asynchronous event processing
Maintainability
Modular architecture
Service/controller separation
Validation layer
Centralized error handling
Environment configuration
Clear API contracts
Observability
Structured logging
Health endpoints
Metrics
Error tracking
ML monitoring
💡 Example Risk Evaluation

Example transaction:

{
  "merchant": "Amazon",
  "amount": 75000,
  "currency": "INR",
  "deviceId": "NEW-DEVICE-92",
  "locationCity": "Mumbai",
  "transactionType": "purchase"
}

The current rule engine evaluates:

Amount anomaly
      +30

New device
      +25

----------------

Risk Score
      55

Result:

Risk Score: 55
Risk Level: MEDIUM
Status: APPROVED

Additional velocity and location anomaly signals can increase the score further.

🧠 Why RiskForge?

RiskForge demonstrates practical engineering across multiple domains:

Frontend
   +
Backend
   +
Database
   +
Authentication
   +
Security
   +
Real-Time Systems
   +
Machine Learning
   +
AI/RAG
   +
Cloud Deployment

This makes the project suitable for demonstrating skills relevant to:

Software Engineering
Full Stack Engineering
Backend Engineering
AI/ML Engineering
Data Engineering
Cloud Engineering
👨‍💻 Engineering Highlights

The project focuses on solving realistic engineering problems such as:

How should fraud risk be calculated?
How can high-risk transactions be detected in real time?
How should ML inference be separated from the API layer?
How can transaction data be queried efficiently?
How should authentication and authorization be implemented?
How can Redis be used for real-time systems?
How can fraud alerts reach analysts immediately?
How can an LLM be grounded using transaction evidence?
How should services be deployed independently?
How can the system scale as transaction volume increases?
🔮 Future Improvements

Potential future enhancements:

Kafka-based event streaming
Feature store
Advanced anomaly detection
Graph-based fraud detection
User behavioral profiling
Device fingerprinting
Geolocation intelligence
Merchant intelligence
Explainable ML
Model drift detection
Automated fraud case creation
Human-in-the-loop model feedback
Multi-tenant architecture
Kubernetes deployment
AWS infrastructure
Infrastructure as Code
Advanced observability
📜 License

This project is currently intended as a portfolio and engineering demonstration project.

A production license will be defined before public commercial usage.

⭐ Project Status
RiskForge
│
├── Frontend              🟢 Foundation Ready
├── Backend               🟢 Foundation Ready
├── Authentication        🟢 Implemented
├── PostgreSQL            🟢 Configured
├── Redis                 🟢 Configured
├── Fraud Engine          🟢 Initial Version
├── Alerts                🟢 Initial Version
├── ML Service            🟡 Foundation
├── Real-Time Engine      🟡 Planned
├── AI Investigator       🟡 Planned
├── RAG                   🟡 Planned
└── Production Hardening  🟡 In Progress
🚀 RiskForge
Real-Time AI Fraud Detection & Risk Intelligence Platform
Detect.
Analyze.
Investigate.
Respond.

Built with React, Node.js, PostgreSQL, Redis, Python, XGBoost, FastAPI and AI.