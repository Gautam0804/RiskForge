# RiskForge — Real-Time AI Fraud Detection & Risk Intelligence Platform

> A production-oriented fraud detection and risk intelligence platform for analyzing transactions, identifying suspicious activity, and assisting analysts with AI-powered investigations.

RiskForge combines **React, Node.js, Express.js, PostgreSQL, Redis, Python, FastAPI, and Machine Learning** into a service-oriented fraud detection platform.

The system is designed around a simple goal:

**Turn transaction data into actionable risk intelligence.**

---

## 🚀 Overview

Financial fraud detection requires more than identifying suspicious transactions.

A useful fraud detection system needs to:

- Analyze transaction behavior
- Assign meaningful risk scores
- Identify potentially fraudulent activity
- Prioritize high-risk transactions
- Generate alerts
- Support analyst investigations
- Maintain secure access to sensitive operations

RiskForge brings these capabilities together through a centralized security-operations-style dashboard.

The platform separates the **frontend, backend, database, caching infrastructure, and ML service**, creating a foundation that can evolve toward a production-scale risk intelligence platform.

---

# 🏗️ Architecture

```text
                         RiskForge
                            │
                            ▼
                 ┌─────────────────────┐
                 │    React Client      │
                 │     Vite + JS        │
                 └──────────┬──────────┘
                            │
                         REST API
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Node.js + Express  │
                 │      RiskForge API   │
                 └────────┬──────┬─────┘
                          │      │
             ┌────────────┘      └─────────────┐
             ▼                                ▼
    ┌─────────────────┐              ┌─────────────────┐
    │   PostgreSQL    │              │      Redis      │
    │ Transaction Data│              │ Cache / Services│
    └─────────────────┘              └─────────────────┘
                          │
                       ML Requests
                          │
                          ▼
                 ┌─────────────────────┐
                 │  Python ML Service  │
                 │  FastAPI + Models   │
                 └─────────────────────┘

Service Responsibilities
Service	Responsibility
React	Dashboard, alerts, analytics and investigations
Node.js / Express	REST APIs, authentication and business logic
PostgreSQL	Persistent application and transaction data
Redis	Caching and infrastructure services
Python / FastAPI	ML inference and AI investigation
Docker	Local infrastructure


✨ Features
🔐 Authentication & Authorization
RiskForge implements secure authentication using JWT-based authentication.
Current capabilities include:
- User registration
- Login
- Protected routes
- JWT authentication
- Role-based authorization
- Password hashing with bcrypt
- Password change
- Token versioning
- Session invalidation
- Active/inactive account validation
- Authentication middleware
📊 Risk Intelligence Dashboard
The main dashboard provides an overview of the current transaction risk environment.
It includes:
- Total transaction statistics
- Risk distribution
- High-risk transactions
- Critical transactions
- Fraud alerts
- Risk trends
- Security monitoring information
The interface is designed around an analyst/security-operations workflow, rather than a basic CRUD dashboard.
💳 Transaction Monitoring
RiskForge provides transaction-level monitoring and analysis.
Transactions can contain:
- Transaction ID
- Amount
- Currency
- Transaction type
- Location
- Risk score
- Fraud probability
- Risk factors
- Transaction status
Transactions support:
- Filtering
- Pagination
- Risk-based analysis
- Investigation workflows
🚨 Alert Center
The Alert Center provides a centralized view of suspicious activity.
Analysts can:
- Review alerts
- Filter alerts
- Search alerts
- View risk levels
- Check alert status
- Investigate suspicious transactions
- Navigate to AI-assisted investigation
Risk Levels
LOW
MEDIUM
HIGH
CRITICAL

🔎 Investigation Management
RiskForge provides an investigation workflow for suspicious transactions.
An investigation can contain:
- Transaction information
- Risk score
- Fraud probability
- Risk factors
- AI-generated summary
- Investigation status
- Analyst decision
- Investigation timestamps
Supported investigation actions include:
Approve
Review
Block

This creates a workflow from:
Suspicious Transaction
        ↓
Alert
        ↓
Investigation
        ↓
AI Analysis
        ↓
Analyst Decision

🤖 AI Investigator
The AI Investigator allows analysts to investigate individual transactions using the separate ML service.
The investigation interface provides:
- Transaction risk analysis
- Risk scoring
- Fraud probability
- Risk factors
- AI-generated summary
- Investigation recommendations
- Risk factor visualization
The ML service is separated from the Node.js API to maintain a clean service-oriented architecture.
Node.js API
     │
     │ ML Request
     ▼
Python FastAPI
     │
     ▼
ML Model / Analysis
     │
     ▼
Risk Intelligence
     │
     ▼
Node.js API
     │
     ▼
Analyst Dashboard

📈 Analytics
The Analytics section provides a visual overview of transaction and risk behavior.
Current analytics include:
- Total transactions
- High-risk transactions
- Critical transactions
- Average risk score
- Risk distribution
- Transaction type distribution
- Highest-risk transactions
- Risk/status tables
⚙️ Settings
RiskForge includes a centralized settings interface.
Current sections include:
- Profile
- Users & Roles
- Fraud Rules
- Notifications
- API Keys
- Audit Logs
- System Configuration
The system configuration section provides service status information for:
PostgreSQL
Node.js API
AI/ML Service
Redis

🔒 Security
Security is a core part of the RiskForge architecture.
Current security mechanisms include:
- JWT authentication
- Password hashing
- Token versioning
- Protected API routes
- Role-based authorization
- Helmet security headers
- CORS configuration
- Rate limiting
- Input validation
- Active account validation
- Session invalidation after password changes
- Environment-based configuration
Secrets are kept outside the repository through environment variables.
Never commit .env files, API keys, JWT secrets, database passwords, or other credentials to Git.

🗄️ Database
RiskForge uses PostgreSQL as its primary relational database.
The database stores application information including:
- Users
- Transactions
- Alerts
- Investigations
- Risk information
- Authentication state
Database migrations are maintained under:
server/src/db/migrations/

Development seed functionality is available through:
server/src/db/seed.js

⚡ Redis
Redis is included as part of the RiskForge infrastructure.
It provides a foundation for:
- Caching
- Temporary risk information
- Session-related infrastructure
- Rate limiting
- Future event-processing functionality
🐳 Docker
RiskForge uses Docker Compose for local infrastructure.
The development environment includes:
PostgreSQL
Redis

Start infrastructure:
docker compose -f docker/docker-compose.yml up -d

Check containers:
docker ps

Stop infrastructure:
docker compose -f docker/docker-compose.yml down

🛠️ Tech Stack
Frontend
- React
- JavaScript
- Vite
- React Router
- Axios
- Lucide React
- CSS
Backend
- Node.js
- Express.js
- PostgreSQL
- Redis
- JWT
- bcrypt
- Helmet
- CORS
- Express Rate Limit
- Morgan
AI / Machine Learning
- Python
- FastAPI
- Scikit-learn
- Pandas
- NumPy
Infrastructure
- Docker
- Docker Compose
- PostgreSQL
- Redis
📁 Project Structure
RiskForge/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── alerts/
│   │   │   ├── analytics/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   └── investigations/
│   │   │
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── alerts/
│   │   │   ├── analytics/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── investigations/
│   │   │   ├── settings/
│   │   │   └── transactions/
│   │   │
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   │   ├── migrations/
│   │   │   └── seed.js
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── ml-service/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── docker/
│   └── docker-compose.yml
│
├── .gitignore
└── README.md

⚙️ Local Development
Prerequisites
Install:
- Node.js
- npm
- Python 3
- Docker Desktop
- Git
1. Clone the Repository
git clone https://github.com/Gautam0804/RiskForge.git
cd RiskForge

2. Start PostgreSQL and Redis
docker compose -f docker/docker-compose.yml up -d

Verify:
docker ps

🖥️ Backend Setup
Navigate to the server:
cd server

Install dependencies:
npm install

Create a local .env file.
Example:
NODE_ENV=development
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d

REDIS_URL=redis://localhost:6379

ML_SERVICE_URL=http://localhost:8000

CORS_ORIGINS=http://localhost:5173

Run database migrations according to the project's migration setup.
Seed development data if required:
node src/db/seed.js

Start the backend:
npm run dev

Backend:
http://localhost:5000

Health check:
GET /api/health

🤖 ML Service Setup
Navigate to the ML service:
cd ml-service

Create a virtual environment:
python -m venv venv

Windows
venv\Scripts\activate

Install dependencies:
pip install -r requirements.txt

Start FastAPI:
uvicorn main:app --reload --port 8000

ML service:
http://localhost:8000

🌐 Frontend Setup
Navigate to the client:
cd client

Install dependencies:
npm install

Configure:
VITE_API_URL=http://localhost:5000/api

Start the development server:
npm run dev

Frontend:
http://localhost:5173

🔄 Running the Complete System
Start infrastructure:
docker compose -f docker/docker-compose.yml up -d

Start ML service:
uvicorn main:app --reload --port 8000

Start backend:
npm run dev

Start frontend:
npm run dev

Then open:
http://localhost:5173

🔌 API Overview
Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PATCH /api/auth/change-password

Transactions
GET /api/transactions

Alerts
GET /api/alerts

Dashboard
GET /api/dashboard

Analytics
GET /api/analytics

Investigations
GET /api/investigations
PATCH /api/investigations/:id/status

AI Investigator
POST /api/ai-investigator

Health
GET /api/health

🧠 Risk Scoring
RiskForge classifies transactions according to their calculated risk level.
The current risk classification follows:
0 ───────────────── 69    LOW / MEDIUM

70 ──────────────── 89    HIGH

90 ─────────────── 100    CRITICAL

Risk signals can include:
- Transaction amount
- Transaction behavior
- Location
- Transaction type
- Historical patterns
- Anomalous activity
- Model-generated fraud probability
Risk scoring is part of the application's current development implementation and should not be interpreted as a production financial fraud model without proper validation against real-world datasets.

🔄 Transaction Analysis Flow
A typical transaction analysis follows:
Transaction
     │
     ▼
RiskForge API
     │
     ▼
Validation
     │
     ▼
Risk Analysis
     │
     ▼
Python ML Service
     │
     ▼
Risk Score + Fraud Probability
     │
     ▼
PostgreSQL
     │
     ▼
Alert / Investigation
     │
     ▼
Analyst Dashboard

🎯 Engineering Goals
RiskForge was built to explore realistic software engineering challenges around fraud detection and risk intelligence.
The project focuses on:
- Full-stack application architecture
- Secure authentication
- REST API design
- PostgreSQL data modeling
- Redis infrastructure
- Service-oriented ML architecture
- AI-assisted investigation workflows
- Analyst-focused dashboards
- Containerized development
- Independent service deployment
🧪 Testing
The project is being developed with a layered testing strategy.
Frontend
Component Tests
       ↓
Integration Tests

Backend
Unit Tests
    ↓
API Tests
    ↓
Authentication Tests

ML Service
Model Tests
     ↓
API Tests
     ↓
Prediction Validation

The testing layer will expand as the application moves toward production readiness.
🛣️ Roadmap
Short-Term
- [ ] Comprehensive automated testing
- [ ] Improved fraud scoring
- [ ] Advanced anomaly detection
- [ ] Improved investigation workflows
- [ ] Better audit logging
- [ ] Stronger RBAC
Medium-Term
- [ ] Real-time transaction streaming
- [ ] WebSocket alerts
- [ ] Kafka-based event processing
- [ ] Explainable AI
- [ ] Model retraining pipelines
- [ ] Feature store integration
- [ ] Model monitoring
- [ ] ML drift detection
Long-Term
- [ ] Automated case management
- [ ] SIEM integrations
- [ ] Email / Slack notifications
- [ ] Multi-tenant architecture
- [ ] CI/CD pipelines
- [ ] Cloud-native deployment
- [ ] Advanced risk intelligence
📦 Deployment Architecture
A production deployment can separate the platform into independently scalable services:
                         Internet
                            │
                            ▼
                    ┌──────────────┐
                    │   Frontend   │
                    │ React / CDN  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Node / API   │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       ┌─────────────┐           ┌─────────────┐
       │ PostgreSQL  │           │    Redis    │
       └─────────────┘           └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Python ML   │
                    │   Service    │
                    └──────────────┘

📌 Project Status
Active Development
RiskForge currently provides a working foundation for:
Authentication
      ↓
Transaction Monitoring
      ↓
Risk Analysis
      ↓
Alerts
      ↓
Investigations
      ↓
AI-Assisted Analysis
      ↓
Analyst Dashboard

The platform is being incrementally improved toward a more production-ready fraud detection and risk intelligence system.
👨‍💻 Author
Gautam Yadav
Software Engineer · Full-Stack Developer · AI/ML Enthusiast
GitHub:
https://github.com/Gautam0804
⭐ Project Vision
RiskForge aims to evolve into an intelligent risk operations platform capable of helping analysts:
- Detect suspicious transactions
- Prioritize high-risk activity
- Investigate potential fraud
- Understand risk factors
- Make faster analyst decisions
- Monitor transaction risk in real time
📄 License
This project is currently developed as a portfolio project.
Add an appropriate open-source license before distributing the project publicly.
Built with code, curiosity & chai ☕
