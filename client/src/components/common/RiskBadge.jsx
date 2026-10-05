export default function RiskBadge({ risk, score }) {
    let level = risk;

    if (!level && score !== undefined) {
        const numericScore = Number(score);

        if (numericScore >= 80) {
            level = "high";
        } else if (numericScore >= 50) {
            level = "medium";
        } else {
            level = "low";
        }
    }

    level = String(level || "low").toLowerCase();

    const formattedLevel =
        level.charAt(0).toUpperCase() + level.slice(1);

    return (
        <span className={`risk-badge risk-${level}`}>
            {formattedLevel}
        </span>
    );
}
