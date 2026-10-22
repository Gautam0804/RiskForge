
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    ShieldCheck,
    Lock,
    Mail,
    Loader2,
    AlertCircle,
    BrainCircuit,
    Activity,
    Zap,
    ArrowRight,
    ScanSearch,
    Radio,
    Network,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import "./Login.css";

const features = [
    {
        id: "ai",
        number: "01",
        title: "AI Detection",
        description:
            "Detect anomalies and uncover suspicious transaction patterns.",
        metric: "98.7%",
        metricLabel: "MODEL CONFIDENCE",
        icon: BrainCircuit,
        className: "feature-blue",
        signal: "AI ENGINE ACTIVE",
    },
    {
        id: "monitor",
        number: "02",
        title: "Real-Time Monitoring",
        description:
            "Track high-risk activity as it happens across your network.",
        metric: "LIVE",
        metricLabel: "TRANSACTION STREAM",
        icon: Activity,
        className: "feature-cyan",
        signal: "LIVE MONITORING",
    },
    {
        id: "intel",
        number: "03",
        title: "Risk Intelligence",
        description:
            "Convert complex risk signals into actionable insights.",
        metric: "360°",
        metricLabel: "RISK VISIBILITY",
        icon: Zap,
        className: "feature-violet",
        signal: "INTELLIGENCE READY",
    },
];

export default function Login() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const emailRef = useRef(null);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) setError("");
    }

    function validateForm() {
        const email = form.email.trim();

        if (!email) return "Email address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "Please enter a valid email address.";
        }
        if (!form.password) return "Password is required.";

        return "";
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (loading) return;

        setError("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const email = form.email.trim().toLowerCase();

            await login(email, form.password);

            const destination =
                location.state?.from?.pathname || "/dashboard";

            navigate(destination, { replace: true });
        } catch (error) {
            console.error("Login failed:", error);

            setError(
                error?.response?.data?.message ||
                    error?.message ||
                    "Unable to sign in. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <div className="login-bg-grid" aria-hidden="true" />
            <div className="login-background-glow login-glow-one" />
            <div className="login-background-glow login-glow-two" />

            {/* LEFT: BRAND AND 3D FEATURE CARDS */}
            <section className="login-product-panel">
                <div className="login-product-content">
                    <div className="login-product-brand">
                        <div className="login-product-logo">
                            <ShieldCheck size={27} strokeWidth={2.2} />
                        </div>

                        <div>
                            <h1>RiskForge</h1>
                            <span>AI Risk Intelligence Platform</span>
                        </div>
                    </div>

                    <div className="login-product-heading">
                        <span className="login-product-eyebrow">
                            <span className="login-live-dot" />
                            REAL-TIME FRAUD INTELLIGENCE
                        </span>

                        <h2>
                            Detect risk.
                            <br />
                            <span>Investigate faster.</span>
                        </h2>

                        <p>
                            Detect suspicious activity, monitor transactions
                            in real time, and turn complex risk signals into
                            clear, actionable intelligence.
                        </p>
                    </div>

                    <div className="feature-stage">
                        <div className="feature-stage-label">
                            <span className="stage-label-line" />
                            INTELLIGENCE MODULES
                            <span className="stage-label-count">03</span>
                        </div>

                        <div className="login-product-features">
                            {features.map((feature) => {
                                const Icon = feature.icon;

                                return (
                                    <article
                                        className={`login-product-feature ${feature.className}`}
                                        key={feature.id}
                                    >
                                        <div className="feature-card-edge" />

                                        <div className="feature-card-top">
                                            <div className="login-feature-icon">
                                                <Icon size={20} />
                                            </div>

                                            <span className="feature-number">
                                                {feature.number}
                                            </span>
                                        </div>

                                        <div className="feature-card-body">
                                            <h3>{feature.title}</h3>
                                            <p>{feature.description}</p>
                                        </div>

                                        <div className="feature-card-metric">
                                            <div>
                                                <strong>{feature.metric}</strong>
                                                <span>{feature.metricLabel}</span>
                                            </div>

                                            <div className="feature-signal-icon">
                                                {feature.id === "ai" && (
                                                    <ScanSearch size={19} />
                                                )}
                                                {feature.id === "monitor" && (
                                                    <Radio size={19} />
                                                )}
                                                {feature.id === "intel" && (
                                                    <Network size={19} />
                                                )}
                                            </div>
                                        </div>

                                        <div className="feature-card-status">
                                            <span className="feature-status-dot" />
                                            {feature.signal}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>

                    <div className="login-intelligence-card">
                        <div className="login-intelligence-header">
                            <div>
                                <span>RISK INTELLIGENCE</span>
                                <strong>Live Detection Engine</strong>
                            </div>

                            <div className="login-intelligence-status">
                                <span />
                                ACTIVE
                            </div>
                        </div>

                        <div
                            className="login-intelligence-chart"
                            aria-label="Illustrative risk signal chart"
                        >
                            <div className="chart-grid-lines" />
                            <div className="chart-line chart-line-one" />
                            <div className="chart-line chart-line-two" />
                            <div className="chart-line chart-line-three" />

                            <div className="chart-point point-one" />
                            <div className="chart-point point-two" />
                            <div className="chart-point point-three" />
                            <div className="chart-point point-four" />
                            <div className="chart-point point-five" />
                        </div>

                        <div className="login-intelligence-footer">
                            <span>Detection engine operational</span>
                            <ArrowRight size={14} />
                        </div>
                    </div>

                    <div className="login-product-footer">
                        <span>RiskForge Security Platform</span>
                        <span className="footer-separator">•</span>
                        <span>AI Fraud Detection</span>
                    </div>
                </div>
            </section>

            {/* RIGHT: AUTHENTICATION */}
            <section className="login-auth-panel">
                <div className="login-card">
                    <div className="login-header">
                        <span className="login-eyebrow">SECURE ACCESS</span>
                        <h2>Welcome back</h2>
                        <p>Sign in to your risk operations console.</p>
                    </div>

                    {error && (
                        <div
                            className="login-error"
                            role="alert"
                            aria-live="polite"
                        >
                            <AlertCircle size={17} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>

                            <div className="login-input-wrapper">
                                <Mail
                                    className="login-input-icon"
                                    size={17}
                                />

                                <input
                                    ref={emailRef}
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="admin@riskforge.com"
                                    autoComplete="email"
                                    spellCheck="false"
                                    autoCapitalize="none"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>

                            <div className="login-input-wrapper">
                                <Lock
                                    size={16}
                                    className="login-input-icon"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={loading}
                                    required
                                />

                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={() =>
                                        setShowPassword((previous) => !previous)
                                    }
                                    disabled={loading}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="login-security-note">
                            <ShieldCheck size={17} />

                            <div>
                                <strong>Protected session</strong>
                                <span>
                                    Your authentication session is securely
                                    managed by RiskForge.
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                            aria-busy={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="login-spinner"
                                    />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <Lock size={16} />
                                    <span>Sign in</span>
                                    <ArrowRight
                                        size={16}
                                        className="login-submit-arrow"
                                    />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-demo">
                        <div className="login-demo-header">
                            <span>Development environment</span>
                            <span className="login-status-dot" />
                        </div>
                        <small>admin@riskforge.com</small>
                    </div>

                    <div className="login-footer">
                        <span>RiskForge</span>
                        <span>•</span>
                        <span>Secure access</span>
                    </div>
                </div>
            </section>
        </main>
    );
}
