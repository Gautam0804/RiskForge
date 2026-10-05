export default function StatCard({ title, value, icon: Icon }) {
    return (
        <div className="stat-card">
            <div className="stat-card-top">
                <span className="stat-card-title">{title}</span>

                <div className="stat-card-icon">
                    {Icon && <Icon size={21} strokeWidth={1.8} />}
                </div>
            </div>

            <div className="stat-card-bottom">
                <h2>{value}</h2>

                <span className="stat-card-caption">
                    Compared with recent activity
                </span>
            </div>
        </div>
    );
}