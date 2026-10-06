# 🛡️ RiskForge — AI Fraud Detection & Risk Intelligence Platform

> A full-stack fraud detection and risk intelligence platform for analyzing transactions, identifying suspicious activity, prioritizing risk, and assisting analysts with AI-powered investigations.

RiskForge combines **React, Node.js, Express.js, PostgreSQL, Redis, Python, FastAPI, and Machine Learning** into a service-oriented architecture designed around a simple goal:

> **Turn transaction data into actionable risk intelligence.**

---

## 🚀 Why RiskForge?

Fraud detection is not just about identifying suspicious transactions.

A useful risk intelligence platform should be able to:

- Analyze transaction behavior
- Calculate meaningful risk scores
- Identify potentially fraudulent activity
- Prioritize high-risk transactions
- Generate alerts
- Support investigation workflows
- Provide AI-assisted analysis
- Secure sensitive operations through authentication and authorization

RiskForge brings these capabilities together through an analyst-focused security operations dashboard.

The platform separates the **frontend, backend, database, caching layer, and ML service**, creating a foundation that can evolve toward a production-scale risk intelligence system.

---

# 🏗️ System Architecture

```text
                         RiskForge
                            │
                            ▼
                 ┌─────────────────────┐
                 │    React Client     │
                 │      Vite + JS      │
                 └──────────┬──────────┘
                            │
                         REST API
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Node.js + Express │
                 │     RiskForge API   │
                 └────────┬──────┬─────┘
                          │      │
             ┌────────────┘      └─────────────┐
             ▼                                ▼
      ┌─────────────────┐              ┌─────────────────┐
      │   PostgreSQL    │              │      Redis      │
      │ Persistent Data │              │ Cache / Infra   │
      └─────────────────┘              └─────────────────┘
                          │
                       ML Request
                          │
                          ▼
                 ┌─────────────────────┐
                 │  Python ML Service  │
                 │   FastAPI + ML      │
                 └─────────────────────┘

Service Responsibilities
Service	Responsibility
React	Dashboard, alerts, analytics, investigations
Node.js / Express	REST APIs, authentication, authorization, business logic
PostgreSQL	Persistent application and transaction data
Redis	Caching and infrastructure services
Python / FastAPI	ML inference and AI-assisted investigation
Docker	Local infrastructure orchestration


✨ Core Features
🔐 Authentication & Authorization
RiskForge implements JWT-based authentication with security-focused session management.
Current capabilities
- User registration
- User login
- JWT authentication
- Protected API routes
- Role-based authorization
- Password hashing with bcrypt
- Password change
- Token versioning
- Session invalidation
- Active/inactive account validation
- Authentication middleware
Security mechanisms are treated as part of the application architecture rather than as an afterthought.    Pasted text
📊 Risk Intelligence Dashboard
The dashboard provides an analyst-oriented overview of the transaction risk environment.
Dashboard capabilities
- Total transaction statistics
- Risk distribution
- High-risk transactions
- Critical transactions
- Fraud alerts
- Risk trends
- Security monitoring information
The dashboard is designed around a security-operations workflow, rather than a simple CRUD interface.    Pasted text
💳 Transaction Monitoring
Transactions can be analyzed using multiple risk-related attributes.
Transaction data
- Transaction ID
- Amount
- Currency
- Transaction type
- Location
- Risk score
- Fraud probability
- Risk factors
- Transaction status
Supported operations
- Filtering
- Pagination
- Risk-based analysis
- Investigation workflows
🚨 Alert Center
The Alert Center provides a centralized workflow for suspicious activity.
Analysts can:
- Review alerts
- Search alerts
- Filter alerts
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
RiskForge connects suspicious transactions with an investigation workflow.
An investigation can contain:
- Transaction information
- Risk score
- Fraud probability
- Risk factors
- AI-generated summary
- Investigation status
- Analyst decision
- Investigation timestamps
Investigation Actions
- Approve
- Review
- Block
Investigation Flow
Suspicious Transaction
          ↓
        Alert
          ↓
    Investigation
          ↓
     AI Analysis
          ↓
   Analyst Decision

This creates a workflow closer to a real risk-operations system than a standalone prediction dashboard.    Pasted text
🤖 AI Investigator
The AI Investigator connects the analyst workflow with the dedicated Python ML service.
It provides:
- Transaction risk analysis
- Risk scoring
- Fraud probability
- Risk factors
- AI-generated summaries
- Investigation recommendations
- Risk factor visualization
ML Service Flow
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

The ML service is separated from the Node.js API, keeping inference concerns isolated from the main application layer.    Pasted text
📈 Analytics
The Analytics section provides visibility into transaction and risk behavior.
Current analytics include:
- Total transactions
- High-risk transactions
- Critical transactions
- Average risk score
- Risk distribution
- Transaction type distribution
- Highest-risk transactions
- Risk/status tables
⚙️ Settings & System Configuration
RiskForge includes a centralized settings interface covering:
- Profile
- Users & Roles
- Fraud Rules
- Notifications
- API Keys
- Audit Logs
- System Configuration
System configuration provides service-status visibility for:
- PostgreSQL
- Node.js API
- AI/ML Service
- Redis
🔒 Security Architecture
Security is a core engineering concern within RiskForge.
Implemented security mechanisms
- JWT authentication
- bcrypt password hashing
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
Sensitive configuration is kept outside the repository through environment variables.
Never commit .env files, API keys, JWT secrets, database passwords, or other credentials.

🗄️ Data Layer
PostgreSQL
PostgreSQL is the primary relational database.
It stores:
- Users
- Transactions
- Alerts
- Investigations
- Risk information
- Authentication state
Database migrations are maintained under:
server/src/db/migrations/

Development seed functionality:
server/src/db/seed.js

⚡ Redis
Redis provides infrastructure for:
- Caching
- Temporary risk information
- Session-related infrastructure
- Rate limiting
- Future event-processing functionality
🐳 Docker Infrastructure
Docker Compose is used for local infrastructure.
Current development infrastructure includes:
- PostgreSQL
- Redis
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

🔌 API Architecture
Authentication
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PATCH  /api/auth/change-password

Transactions
GET /api/transactions

Alerts
GET /api/alerts

Dashboard
GET /api/dashboard

Analytics
GET /api/analytics

Investigations
GET   /api/investigations
PATCH /api/investigations/:id/status

AI Investigator
POST /api/ai-investigator

Health
GET /api/health

🧠 Risk Scoring
RiskForge currently classifies transactions according to their calculated risk level.
0 ───────────────── 69     LOW / MEDIUM

70 ──────────────── 89     HIGH

90 ─────────────── 100     CRITICAL

Potential risk signals include:
- Transaction amount
- Transaction behavior
- Location
- Transaction type
- Historical patterns
- Anomalous activity
- Model-generated fraud probability
⚠️ The current scoring implementation is a portfolio/development system and should not be interpreted as a production financial fraud model without validation against representative real-world datasets.

This distinction is important because the project demonstrates the engineering architecture and ML integration, rather than claiming production-grade financial-model accuracy.    Pasted text
🔄 Transaction Analysis Flow
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

🎯 Engineering Focus
RiskForge was built to explore realistic software-engineering problems around fraud detection and risk intelligence.
Key engineering areas
- Full-stack application architecture
- Secure authentication
- REST API design
- PostgreSQL data modeling
- Redis infrastructure
- Service-oriented ML architecture
- AI-assisted investigation workflows
- Analyst-focused dashboards
- Containerized development
- Scalable service boundaries
🧪 Testing Strategy
The project follows a layered testing direction.
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

The testing layer will expand as the platform moves toward production readiness.
🛣️ Roadmap
Short Term
- [ ] Comprehensive automated testing
- [ ] Improved fraud scoring
- [ ] Advanced anomaly detection
- [ ] Improved investigation workflows
- [ ] Better audit logging
- [ ] Stronger RBAC
Medium Term
- [ ] Real-time transaction streaming
- [ ] WebSocket alerts
- [ ] Kafka-based event processing
- [ ] Explainable AI
- [ ] Model retraining pipelines
- [ ] Feature store integration
- [ ] Model monitoring
- [ ] ML drift detection
Long Term
- [ ] Automated case management
- [ ] SIEM integrations
- [ ] Email / Slack notifications
- [ ] Multi-tenant architecture
- [ ] CI/CD pipelines
- [ ] Cloud-native deployment
- [ ] Advanced risk intelligence
☁️ Future Deployment Architecture
The architecture is designed so that the major services can eventually be deployed and scaled independently.
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
              ┌─────────────┴─────────────┐
              ▼                           ▼
       ┌─────────────┐             ┌─────────────┐
       │ PostgreSQL  │             │    Redis    │
       └─────────────┘             └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Python ML   │
                     │   Service    │
                     └──────────────┘

📌 Current Project Status
🟢 Implemented
- Authentication
- JWT authorization
- Role-based access
- Transaction monitoring
- Risk analysis
- Alerts
- Investigation workflow
- AI-assisted analysis
- Analyst dashboard
- PostgreSQL integration
- Redis infrastructure
- Separate Python/FastAPI ML service
- Dockerized local infrastructure
🟡 In Development / Expansion
- Automated testing
- Advanced fraud scoring
- Advanced anomaly detection
- Investigation improvements
- Audit logging
- Stronger RBAC
🔵 Planned
- Real-time streaming
- WebSocket alerts
- Kafka
- Explainable AI
- Model retraining
- Feature store
- Model monitoring
- Drift detection
- SIEM integration
- CI/CD
- Cloud deployment
- Multi-tenancy
⚙️ Local Development
Prerequisites
Install:
- Node.js
- npm
- Python 3
- Docker Desktop
- Git
1. Clone Repository
git clone https://github.com/Gautam0804/RiskForge.git
cd RiskForge

2. Start PostgreSQL & Redis
docker compose -f docker/docker-compose.yml up -d

Verify:
docker ps

3. Backend Setup
cd server
npm install

Create .env:
NODE_ENV=development
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d

REDIS_URL=redis://localhost:6379

ML_SERVICE_URL=http://localhost:8000

CORS_ORIGINS=http://localhost:5173

Run migrations according to the project's migration setup.
Seed development data if required:
node src/db/seed.js

Start backend:
npm run dev

Backend:
http://localhost:5000

Health check:
GET /api/health

4. ML Service Setup
cd ml-service

Create virtual environment:
python -m venv venv

Windows
venv\Scripts\activate

Install dependencies:
pip install -r requirements.txt

Start FastAPI:
uvicorn main:app --reload --port 8000

ML service:
http://localhost:8000

5. Frontend Setup
cd client
npm install

Configure:
VITE_API_URL=http://localhost:5000/api

Start:
npm run dev

Frontend:
http://localhost:5173

🔄 Running the Complete System
Docker
  ↓
PostgreSQL + Redis
  ↓
Python ML Service
  ↓
Node.js API
  ↓
React Frontend

Open:
http://localhost:5173

📱 Responsive Design
The frontend is designed to work across:
- 🖥️ Desktop
- 💻 Laptop
- 📱 Tablet
- 📱 Mobile
The interface focuses on maintaining usability across different screen sizes.
🧩 Engineering Principles
RiskForge follows several engineering principles:
Separation of Concerns
Frontend, API, database, infrastructure, and ML responsibilities are separated.
Security First
Authentication, authorization, validation, rate limiting, and secure configuration are treated as first-class concerns.
Service-Oriented Design
The ML service is separated from the Node.js application to establish clear service boundaries.
Data-Driven Application
Core transaction, alert, investigation, and risk information is backed by PostgreSQL.
Maintainability
The backend is organized around:
Routes
Controllers
Services
Models
Middleware
Database
Utilities

Scalable Foundation
Redis, Docker, service separation, and structured APIs provide a foundation for future scaling.
💼 Resume Description
RiskForge — AI Fraud Detection & Risk Intelligence Platform
Developed a full-stack fraud detection platform using React, Node.js, Express.js, PostgreSQL, Redis, Python, and FastAPI. Implemented JWT authentication, RBAC, transaction monitoring, risk scoring, alert management, investigation workflows, and AI-assisted analysis through a dedicated ML service. Designed a service-oriented architecture with containerized infrastructure and a roadmap toward real-time streaming, explainable AI, model monitoring, and cloud deployment.

🧠 What This Project Demonstrates
Frontend Engineering
- React application architecture
- Reusable components
- Dashboard development
- API integration
- Authentication flows
- Data visualization
Backend Engineering
- REST API design
- Authentication & authorization
- Middleware
- Business logic
- PostgreSQL integration
- Redis integration
- Error handling
AI / ML Engineering
- Python ML service
- FastAPI inference layer
- Risk scoring
- Fraud probability
- AI-assisted investigation
- ML service separation
Security Engineering
- JWT
- bcrypt
- RBAC
- Rate limiting
- Helmet
- CORS
- Input validation
- Session invalidation
DevOps / Infrastructure
- Docker
- Docker Compose
- PostgreSQL containers
- Redis containers
- Environment configuration
- Service-based architecture
📊 Project Status
🟢 Active Development
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
🔮 Vision
RiskForge aims to evolve into an intelligent risk operations platform capable of helping analysts:
- Detect suspicious transactions
- Prioritize high-risk activity
- Investigate potential fraud
- Understand risk factors
- Make faster investigation decisions
- Monitor transaction risk in real time
👨‍💻 Author
Gautam Yadav
Software Engineer · Full-Stack Developer · AI/ML Enthusiast
🔗 GitHub:
https://github.com/Gautam0804
📄 License
This project is currently developed as a portfolio project.
An appropriate open-source license should be added before public distribution.
⭐ Final Note
RiskForge is built to demonstrate more than CRUD development.
It focuses on:
Architecture → Security → Data → APIs → ML → Investigation Workflows → Scalability

Built with code, curiosity & chai ☕
