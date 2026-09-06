export default function RiskBadge({ score }) {
    let level = "low";

    if (score >= 80) {
        level = "high";
    } else if (score >= 50) {
        level = "medium";
    }

    return (
        <span className={`risk-badge risk-${level}`}>
            {score}
        </span>
    );
}