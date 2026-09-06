export default function LoadingSpinner({
    size = "medium",
    text = "Loading..."
}) {
    return (
        <div className={`loading-state loading-${size}`}>
            <div className="loading-spinner" />

            {text && (
                <span>{text}</span>
            )}
        </div>
    );
}