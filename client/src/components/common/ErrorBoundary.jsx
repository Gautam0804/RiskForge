import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError() {
        return {
            hasError: true
        };
    }

    componentDidCatch(error, errorInfo) {
        console.error(
            "RiskForge UI Error:",
            error,
            errorInfo
        );
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-page">
                    <div className="error-card">
                        <div className="error-icon">
                            <AlertTriangle size={24} />
                        </div>

                        <h1>Something went wrong</h1>

                        <p>
                            RiskForge encountered an unexpected
                            interface error.
                        </p>

                        <button onClick={this.handleReload}>
                            <RefreshCw size={15} />
                            Reload application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}