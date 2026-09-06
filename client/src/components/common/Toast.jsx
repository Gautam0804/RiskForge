import {
    CheckCircle2,
    AlertTriangle,
    Info,
    X
} from "lucide-react";

const icons = {
    success: CheckCircle2,
    error: AlertTriangle,
    warning: AlertTriangle,
    info: Info
};

export default function Toast({
    message,
    type = "info",
    onClose
}) {
    const Icon = icons[type] || Info;

    return (
        <div className={`toast toast-${type}`}>
            <Icon size={17} />

            <span>{message}</span>

            <button onClick={onClose}>
                <X size={14} />
            </button>
        </div>
    );
}