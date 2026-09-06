import { Inbox } from "lucide-react";

export default function EmptyState({
    title = "No data found",
    description = "There is nothing to display here.",
    action
}) {
    return (
        <div className="empty-state">
            <div className="empty-icon">
                <Inbox size={20} />
            </div>

            <h3>{title}</h3>

            <p>{description}</p>

            {action && (
                <div className="empty-action">
                    {action}
                </div>
            )}
        </div>
    );
}