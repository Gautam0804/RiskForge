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
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import "./Login.css";

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

        if (error) {
            setError("");
        }
    }

    function validateForm() {
        const email = form.email.trim();

        if (!email) {
            return "Email address is required.";
        }

        if (!email.includes("@")) {
            return "Please enter a valid email address.";
        }

        if (!form.password) {
            return "Password is required.";
        }

        return "";
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (loading) {
            return;
        }

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

            navigate(destination, {
                replace: true,
            });
        } catch (error) {
            console.error("Login failed:", error);

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Unable to sign in. Please check your credentials.";

            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">

            {/* =================================================
                Background
            ================================================= */}

            <div className="login-bg-grid" />

            <div className="login-background-glow login-glow-one" />
            <div className="login-background-glow login-glow-two" />


            {/* =================================================
                LEFT PRODUCT PANEL
            ================================================= */}

            <section className="login-product-panel">

                <div className="login-product-content">

                    {/* Brand */}

                    <div className="login-product-brand">

                        <div className="login-product-logo">
                            <ShieldCheck
                                size={27}
                                strokeWidth={2.2}
                            />
                        </div>

                        <div>
                            <h1>RiskForge</h1>

                            <span>
                                AI Risk Intelligence Platform
                            </span>
                        </div>

                    </div>


                    {/* Main heading */}

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
                            RiskForge combines AI-powered detection,
                            real-time transaction monitoring and
                            intelligent investigation workflows to
                            help security teams identify suspicious
                            activity before it becomes a larger threat.
                        </p>

                    </div>


                    {/* Product capabilities */}

                    <div className="login-product-features">

                        <div className="login-product-feature">

                            <div className="login-feature-icon blue">
                                <BrainCircuit size={18} />
                            </div>

                            <div>
                                <strong>
                                    AI-Powered Detection
                                </strong>

                                <span>
                                    Analyze transactions and
                                    identify abnormal risk patterns.
                                </span>
                            </div>

                        </div>


                        <div className="login-product-feature">

                            <div className="login-feature-icon cyan">
                                <Activity size={18} />
                            </div>

                            <div>
                                <strong>
                                    Real-Time Monitoring
                                </strong>

                                <span>
                                    Monitor suspicious activity
                                    and high-risk transactions.
                                </span>
                            </div>

                        </div>


                        <div className="login-product-feature">

                            <div className="login-feature-icon violet">
                                <Zap size={18} />
                            </div>

                            <div>
                                <strong>
                                    Risk Intelligence
                                </strong>

                                <span>
                                    Turn complex signals into
                                    actionable investigation insights.
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* Mini intelligence visualization */}

                    <div className="login-intelligence-card">

                        <div className="login-intelligence-header">

                            <div>
                                <span>
                                    RISK INTELLIGENCE
                                </span>

                                <strong>
                                    Live Detection Engine
                                </strong>
                            </div>

                            <div className="login-intelligence-status">
                                <span />
                                ACTIVE
                            </div>

                        </div>


                        <div className="login-intelligence-chart">

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

                            <span>
                                Detection engine operational
                            </span>

                            <span>
                                <ArrowRight size={13} />
                            </span>

                        </div>

                    </div>


                    {/* Product footer */}

                    <div className="login-product-footer">

                        <span>
                            RiskForge Security Platform
                        </span>

                        <span>•</span>

                        <span>
                            AI Fraud Detection
                        </span>

                    </div>

                </div>

            </section>


            {/* =================================================
                RIGHT LOGIN PANEL
            ================================================= */}

            <section className="login-auth-panel">

                <div className="login-card">

                    {/* Login heading */}

                    <div className="login-header">

                        <span className="login-eyebrow">
                            SECURE ACCESS
                        </span>

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Sign in to your risk operations console.
                        </p>

                    </div>


                    {/* Error */}

                    {error && (
                        <div
                            className="login-error"
                            role="alert"
                            aria-live="polite"
                        >
                            <AlertCircle size={17} />

                            <span>
                                {error}
                            </span>
                        </div>
                    )}


                    {/* Form */}

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        {/* Email */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email address
                            </label>

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


                        {/* Password */}

                   <div className="form-group">
    <label htmlFor="password">
        Password
    </label>

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
            onClick={() => setShowPassword((previous) => !previous)}
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


                        {/* Security */}

                        <div className="login-security-note">

                            <ShieldCheck size={16} />

                            <div>

                                <strong>
                                    Protected session
                                </strong>

                                <span>
                                    Your authentication session
                                    is securely managed by RiskForge.
                                </span>

                            </div>

                        </div>


                        {/* Submit */}

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

                                    <span>
                                        Signing in...
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Lock size={16} />

                                    <span>
                                        Sign in
                                    </span>
                                </>
                            )}

                        </button>

                    </form>


                    {/* Development */}

                    <div className="login-demo">

                        <div className="login-demo-header">

                            <span>
                                Development environment
                            </span>

                            <span className="login-status-dot" />

                        </div>

                        <small>
                            admin@riskforge.com
                        </small>

                    </div>


                    {/* Footer */}

                    <div className="login-footer">

                        <span>
                            RiskForge
                        </span>

                        <span>•</span>

                        <span>
                            Secure access
                        </span>

                    </div>

                </div>

            </section>

        </div>
    );
}