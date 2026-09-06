CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    full_name VARCHAR(150) NOT NULL,

    role VARCHAR(30) NOT NULL DEFAULT 'analyst'
        CHECK (role IN ('admin', 'analyst', 'investigator', 'viewer')),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    last_login_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

-- =====================================================
-- TRANSACTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    transaction_id VARCHAR(50) NOT NULL UNIQUE,

    user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    merchant VARCHAR(150) NOT NULL,

    amount NUMERIC(15, 2) NOT NULL CHECK (amount >= 0),

    currency VARCHAR(10) NOT NULL DEFAULT 'INR',

    device_id VARCHAR(150),

    ip_address INET,

    location_city VARCHAR(100),

    latitude NUMERIC(10, 7),

    longitude NUMERIC(10, 7),

    transaction_type VARCHAR(30) DEFAULT 'purchase',

    status VARCHAR(30) NOT NULL DEFAULT 'approved'
        CHECK (
            status IN (
                'approved',
                'review',
                'blocked',
                'fraud'
            )
        ),

    risk_score NUMERIC(5, 2) NOT NULL DEFAULT 0
        CHECK (risk_score >= 0 AND risk_score <= 100),

    fraud_probability NUMERIC(6, 5) NOT NULL DEFAULT 0
        CHECK (
            fraud_probability >= 0
            AND fraud_probability <= 1
        ),

    risk_level VARCHAR(20) NOT NULL DEFAULT 'low'
        CHECK (
            risk_level IN (
                'low',
                'medium',
                'high',
                'critical'
            )
        ),

    risk_factors JSONB NOT NULL DEFAULT '{}'::jsonb,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    processed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user
ON transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_created
ON transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_risk
ON transactions(risk_score DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_status
ON transactions(status);

CREATE INDEX IF NOT EXISTS idx_transactions_risk_level
ON transactions(risk_level);

-- =====================================================
-- ALERTS
-- =====================================================

CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    alert_id VARCHAR(50) NOT NULL UNIQUE,

    transaction_id UUID
        REFERENCES transactions(id)
        ON DELETE CASCADE,

    alert_type VARCHAR(100) NOT NULL,

    severity VARCHAR(20) NOT NULL DEFAULT 'medium'
        CHECK (
            severity IN (
                'low',
                'medium',
                'high',
                'critical'
            )
        ),

    title VARCHAR(200) NOT NULL,

    description TEXT,

    status VARCHAR(30) NOT NULL DEFAULT 'open'
        CHECK (
            status IN (
                'open',
                'investigating',
                'resolved',
                'dismissed'
            )
        ),

    assigned_to UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_alerts_created
ON alerts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_alerts_status
ON alerts(status);

CREATE INDEX IF NOT EXISTS idx_alerts_severity
ON alerts(severity);

-- =====================================================
-- INVESTIGATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS investigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    investigation_id VARCHAR(50) NOT NULL UNIQUE,

    transaction_id UUID
        REFERENCES transactions(id)
        ON DELETE CASCADE,

    investigator_id UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'open'
        CHECK (
            status IN (
                'open',
                'investigating',
                'resolved',
                'closed'
            )
        ),

    decision VARCHAR(30),

    notes TEXT,

    ai_summary TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    action VARCHAR(100) NOT NULL,

    entity_type VARCHAR(50),

    entity_id UUID,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    ip_address INET,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created
ON audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user
ON audit_logs(user_id);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at
ON users;

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS transactions_updated_at
ON transactions;

CREATE TRIGGER transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS investigations_updated_at
ON investigations;

CREATE TRIGGER investigations_updated_at
BEFORE UPDATE ON investigations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();