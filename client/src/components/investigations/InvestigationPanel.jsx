import {
    ShieldAlert,
    Smartphone,
    MapPin,
    Activity,
    User,
    CheckCircle2,
    XCircle
} from "lucide-react";

import RiskBadge from "../common/RiskBadge";

export default function InvestigationPanel() {
    return (
        <div className="investigation-layout">

            <div className="investigation-card">

                <div className="investigation-card-header">
                    <div>
                        <span className="eyebrow">
                            INVESTIGATION
                        </span>

                        <h2>INV-1042</h2>
                    </div>

                    <RiskBadge score={94} />
                </div>

                <div className="investigation-details">

                    <div>
                        <span>Transaction</span>
                        <strong>TXN-9283</strong>
                    </div>

                    <div>
                        <span>User</span>
                        <strong>Priya Sharma</strong>
                    </div>

                    <div>
                        <span>Amount</span>
                        <strong>₹88,200</strong>
                    </div>

                    <div>
                        <span>Merchant</span>
                        <strong>Amazon</strong>
                    </div>

                </div>

            </div>

            <div className="investigation-card">

                <div className="section-header">
                    <div>
                        <h3>Risk Factors</h3>
                        <p>Signals contributing to the risk score</p>
                    </div>
                </div>

                <div className="risk-factors">

                    <div className="risk-factor">
                        <Activity size={17} />
                        <div>
                            <strong>Transaction velocity</strong>
                            <span>HIGH RISK</span>
                        </div>
                    </div>

                    <div className="risk-factor">
                        <Smartphone size={17} />
                        <div>
                            <strong>New device</strong>
                            <span>HIGH RISK</span>
                        </div>
                    </div>

                    <div className="risk-factor">
                        <MapPin size={17} />
                        <div>
                            <strong>Location anomaly</strong>
                            <span>MEDIUM RISK</span>
                        </div>
                    </div>

                    <div className="risk-factor">
                        <User size={17} />
                        <div>
                            <strong>Amount anomaly</strong>
                            <span>HIGH RISK</span>
                        </div>
                    </div>

                </div>

            </div>

            <div className="investigation-card investigation-ai">

                <div className="section-header">
                    <div>
                        <h3>AI Investigation Summary</h3>
                        <p>RiskForge AI analysis</p>
                    </div>
                </div>

                <div className="ai-summary">
                    <ShieldAlert size={20} />

                    <p>
                        This transaction shows multiple high-risk signals.
                        The transaction amount is significantly above the
                        user's historical average, while the device and
                        transaction velocity are anomalous.
                    </p>
                </div>

                <div className="investigation-actions">

                    <button className="action-approve">
                        <CheckCircle2 size={16} />
                        Approve
                    </button>

                    <button className="action-review">
                        Review
                    </button>

                    <button className="action-block">
                        <XCircle size={16} />
                        Block
                    </button>

                </div>

            </div>

        </div>
    );
}