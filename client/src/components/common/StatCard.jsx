export default function StatCard({
    title,
    value,
    change,
    icon: Icon,
    tone = "default"
}) {
    return (
        <div className={`stat-card ${tone}`}>

            <div className="stat-card-top">

                <span className="stat-title">
                    {title}
                </span>

                {Icon && (
                    <div className="stat-icon">
                        <Icon size={18} />
                    </div>
                )}

            </div>

            <div className="stat-value">
                {value}
            </div>

            {change && (
                <div className="stat-change">
                    {change}
                </div>
            )}

        </div>
    );
}