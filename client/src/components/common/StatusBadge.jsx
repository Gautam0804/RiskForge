export default function StatusBadge({ status }) {
    const className = status
        .toLowerCase()
        .replace(/\s+/g, "-");

    return (
        <span className={`status-badge status-${className}`}>
            {status}
        </span>
    );
}