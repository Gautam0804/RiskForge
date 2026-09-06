import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="error-page">
            <div className="error-card">

                <div className="error-icon">
                    <SearchX size={24} />
                </div>

                <div className="eyebrow">
                    ERROR 404
                </div>

                <h1>Page not found</h1>

                <p>
                    The RiskForge page you are looking for
                    does not exist.
                </p>

                <Link
                    to="/dashboard"
                    className="error-link"
                >
                    <ArrowLeft size={15} />
                    Back to dashboard
                </Link>

            </div>
        </div>
    );
}