import { useState } from "react";
import {
    Bot,
    Send,
    Sparkles,
    User,
    ShieldCheck
} from "lucide-react";

export default function AIInvestigator() {
    const [message, setMessage] = useState("");

    const messages = [
        {
            type: "ai",
            text: "Hello. I'm RiskForge AI Investigator. I can help analyze transactions, identify risk patterns, and investigate suspicious activity."
        },
        {
            type: "user",
            text: "Why was TXN-9283 classified as high risk?"
        },
        {
            type: "ai",
            text: "TXN-9283 received a risk score of 94/100. The strongest contributing factors are an unusually high transaction amount, a new device, abnormal transaction velocity, and a location inconsistent with the user's historical activity."
        }
    ];

    return (
        <div className="ai-page">

            <div className="page-header">
                <div>
                    <h1>AI Investigator</h1>
                    <p>
                        Investigate transactions and fraud patterns using RiskForge AI.
                    </p>
                </div>

                <div className="ai-status">
                    <span className="status-dot" />
                    AI Online
                </div>
            </div>

            <div className="ai-layout">

                <aside className="ai-sidebar">

                    <div className="ai-sidebar-header">
                        <Sparkles size={17} />
                        Investigation Tools
                    </div>

                    <button className="ai-tool active">
                        <ShieldCheck size={16} />
                        Transaction Analysis
                    </button>

                    <button className="ai-tool">
                        <Bot size={16} />
                        Fraud Patterns
                    </button>

                    <button className="ai-tool">
                        <Sparkles size={16} />
                        Similar Cases
                    </button>

                    <div className="ai-sidebar-info">
                        <span>Powered by</span>
                        <strong>RiskForge Intelligence Engine</strong>
                    </div>

                </aside>

                <section className="ai-chat">

                    <div className="ai-chat-header">
                        <div className="ai-avatar">
                            <Bot size={19} />
                        </div>

                        <div>
                            <strong>RiskForge AI</strong>
                            <span>Fraud Investigation Assistant</span>
                        </div>
                    </div>

                    <div className="ai-messages">

                        {messages.map((item, index) => (
                            <div
                                className={`message-row ${item.type}`}
                                key={index}
                            >

                                <div className="message-avatar">
                                    {item.type === "ai" ? (
                                        <Bot size={15} />
                                    ) : (
                                        <User size={15} />
                                    )}
                                </div>

                                <div className="message-bubble">
                                    {item.text}
                                </div>

                            </div>
                        ))}

                    </div>

                    <div className="ai-suggestions">

                        <button
                            onClick={() =>
                                setMessage("Explain the highest risk transactions today")
                            }
                        >
                            Explain highest risk transactions
                        </button>

                        <button
                            onClick={() =>
                                setMessage("Find similar fraud cases")
                            }
                        >
                            Find similar fraud cases
                        </button>

                        <button
                            onClick={() =>
                                setMessage("What fraud patterns are increasing?")
                            }
                        >
                            Analyze fraud patterns
                        </button>

                    </div>

                    <div className="ai-input-wrapper">

                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ask RiskForge AI about transactions, users or fraud..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setMessage("");
                                }
                            }}
                        />

                        <button
                            className="ai-send"
                            onClick={() => setMessage("")}
                        >
                            <Send size={17} />
                        </button>

                    </div>

                </section>

            </div>

        </div>
    );
}