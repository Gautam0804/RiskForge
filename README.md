# RiskForge

## Real-Time AI Fraud Detection & Risk Intelligence Platform

RiskForge is a production-oriented fraud detection and risk intelligence platform designed to identify suspicious financial transactions, calculate risk scores, generate alerts, and assist analysts with AI-powered investigation.

The platform combines a modern web dashboard, REST API, PostgreSQL, Redis, and a separate Python-based machine learning service.

---

## 🚀 Overview

RiskForge provides a centralized security and risk operations console for monitoring financial transactions and investigating potentially fraudulent activity.

### Core capabilities

- Real-time transaction monitoring
- AI/ML-based fraud risk scoring
- Risk classification
- Automated fraud alerts
- Investigation management
- AI-assisted transaction investigation
- Analytics and risk visualization
- Role-based authentication
- Secure password management
- PostgreSQL-backed transaction storage
- Redis integration
- Separate Python ML microservice
- Production-oriented frontend and backend architecture

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │      React Client    │
                         │      Vite + JS       │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │   Node.js + Express  │
                         │      RiskForge API   │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └─────────────┐
                    ▼                                  ▼
          ┌──────────────────┐                ┌──────────────────┐
          │   PostgreSQL     │                │      Redis       │
          │ Transaction Data │                │ Cache / Services │
          └──────────────────┘                └──────────────────┘
                                 │
                                 │ ML Requests
                                 ▼
                         ┌──────────────────────┐
                         │   Python ML Service  │
                         │ FastAPI + ML Models  │
                         └──────────────────────┘

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
- JWT Authentication
- bcrypt
- Helmet
- CORS
- Express Rate Limit
- Morgan
Machine Learning
- Python
- FastAPI
- Scikit-learn
- Pandas
- NumPy
Infrastructure
- Docker
- Docker Compose
- PostgreSQL Docker container
- Redis Docker container
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

✨ Features
🔐 Authentication
RiskForge includes secure authentication using JWT-based sessions.
Features include:
- User registration
- Login
- Protected routes
- JWT authentication
- Role-based authorization
- Password hashing with bcrypt
- Password change
- Token versioning
- Session invalidation
- Account active/inactive validation
- Authentication middleware
📊 Dashboard
The main RiskForge dashboard provides an overview of the current risk environment.
It includes:
- Transaction statistics
- Risk distribution
- High-risk transactions
- Critical transactions
- Fraud alerts
- Risk trends
- Security monitoring information
The dashboard is designed as a security operations-style interface rather than a basic CRUD dashboard.
💳 Transaction Monitoring
RiskForge provides transaction-level monitoring and analysis.
Each transaction can contain information such as:
- Transaction ID
- Amount
- Currency
- Transaction type
- Location
- Risk score
- Fraud probability
- Risk factors
- Transaction status
Transactions can be filtered and paginated for easier investigation.
🚨 Alert Center
The Alert Center provides a centralized location for suspicious activity.
Analysts can:
- Review security alerts
- Filter alerts
- Search alerts
- View risk levels
- Check alert status
- Investigate suspicious transactions
- Navigate directly to AI investigation
Risk levels include:
LOW
MEDIUM
HIGH
CRITICAL

🔎 Investigation Management
RiskForge provides an investigation workflow for suspicious transactions.
Investigations include:
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

🤖 AI Investigator
The AI Investigator allows analysts to investigate individual transactions using the RiskForge ML service.
The investigation interface provides:
- Transaction risk analysis
- Risk scoring
- Fraud probability
- Risk factors
- AI summary
- Investigation recommendations
- Risk factor visualization
The ML service is separated from the Node.js API to maintain a clean service-oriented architecture.
📈 Analytics
The Analytics section provides a visual overview of transaction and risk behavior.
It includes:
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
Available sections include:
- Profile
- Users & Roles
- Fraud Rules
- Notifications
- API Keys
- Audit Logs
- System Configuration
The system configuration section provides service status information for:
- PostgreSQL
- Node.js API
- AI/ML Service
- Redis
🔒 Security
Security is a major part of the RiskForge architecture.
Implemented security measures include:
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
- No secrets committed to Git
Never commit .env files, API keys, JWT secrets, database passwords, or other credentials to the repository.

🗄️ Database
RiskForge uses PostgreSQL as its primary relational database.
The database stores application information such as:
- Users
- Transactions
- Alerts
- Investigations
- Risk information
- Authentication state
Database migrations are maintained inside:
server/src/db/migrations/

Database seed functionality is available through:
server/src/db/seed.js

⚡ Redis
Redis is included as part of the RiskForge infrastructure.
It can be used for:
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

Start the infrastructure:
docker compose -f docker/docker-compose.yml up -d

Check running containers:
docker ps

Stop the infrastructure:
docker compose -f docker/docker-compose.yml down

⚙️ Environment Variables
Create environment files locally.
Backend
Example:
NODE_ENV=development
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d

REDIS_URL=redis://localhost:6379

ML_SERVICE_URL=http://localhost:8000

CORS_ORIGINS=http://localhost:5173

Frontend
Example:
VITE_API_URL=http://localhost:5000/api

ML Service
Configure the Python service according to its local environment and model configuration.
🚀 Installation
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/RiskForge.git
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

Configure .env.
Run database migrations according to the project's migration setup.
Seed development data if required:
node src/db/seed.js

Start the backend:
npm run dev

The API will run on:
http://localhost:5000

Health endpoint:
/api/health

🤖 ML Service Setup
Navigate to the ML service:
cd ml-service

Create a virtual environment:
python -m venv venv

Activate it on Windows:
venv\Scripts\activate

Install dependencies:
pip install -r requirements.txt

Start FastAPI:
uvicorn main:app --reload --port 8000

The ML service will run on:
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

The frontend will normally be available at:
http://localhost:5173

🔄 Running the Complete System
Start infrastructure:
docker compose -f docker/docker-compose.yml up -d

Start the ML service:
uvicorn main:app --reload --port 8000

Start the backend:
npm run dev

Start the frontend:
npm run dev

Then open:
http://localhost:5173

🔑 Development Login
For local development, the seeded administrator account is:
Email: admin@riskforge.com
Password: RiskForge@123

Do not use development credentials in production.
Change or remove seeded credentials before deploying the application to a production environment.
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
RiskForge classifies transactions based on their calculated risk level.
A typical classification model is:
0 ─────────────── 69   LOW / MEDIUM
70 ────────────── 89   HIGH
90 ───────────── 100   CRITICAL

Risk factors can contribute to the final transaction risk score.
Examples of potential risk signals include:
- Transaction amount
- Transaction behavior
- Location
- Transaction type
- Historical patterns
- Anomalous activity
- Model-generated fraud probability
🔄 Request Flow
A typical transaction analysis flow:
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

🎯 Project Goals
RiskForge was designed with a production-oriented mindset rather than as a simple college CRUD application.
The main goals are:
- Build a realistic fraud detection platform
- Separate frontend, backend, and ML responsibilities
- Implement secure authentication
- Practice microservice architecture
- Work with PostgreSQL and Redis
- Build analyst-focused dashboards
- Implement AI-assisted investigation
- Deploy independently scalable services
- Demonstrate full-stack engineering skills
🛣️ Future Improvements
Potential future improvements include:
- Real-time transaction streaming
- Kafka-based event processing
- Advanced anomaly detection
- Model retraining pipelines
- Feature store integration
- Explainable AI
- Advanced RBAC
- Multi-tenant support
- Real-time WebSocket alerts
- Automated case management
- SIEM integrations
- Email/Slack alert integrations
- Model monitoring
- ML drift detection
- CI/CD pipelines
- Cloud deployment
- Comprehensive automated testing
🧪 Testing
Recommended testing layers:
Frontend
   │
   ├── Component Tests
   └── Integration Tests

Backend
   │
   ├── Unit Tests
   ├── API Tests
   └── Authentication Tests

ML Service
   │
   ├── Model Tests
   ├── API Tests
   └── Prediction Validation

📦 Deployment Architecture
A production deployment can separate the services:
                   Internet
                       │
                       ▼
                ┌─────────────┐
                │   Frontend  │
                │ React / CDN │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │ Node / API  │
                └──────┬──────┘
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
      ┌───────────┐        ┌────────────┐
      │ PostgreSQL│        │   Redis    │
      └───────────┘        └────────────┘
                       │
                       ▼
                ┌─────────────┐
                │ Python ML   │
                │  Service    │
                └─────────────┘

👨‍💻 Author
Gautam Kumar Yadav
Full-Stack Developer | AI/ML Enthusiast
📄 License
This project is intended primarily as a portfolio and learning project.
Add an appropriate open-source license before distributing the project publicly.
