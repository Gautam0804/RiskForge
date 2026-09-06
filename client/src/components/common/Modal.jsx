import { X } from "lucide-react";

export default function Modal({
    open,
    title,
    description,
    children,
    onClose,
    width = "520px"
}) {
    if (!open) {
        return null;
    }

    return (
        <div
            className="modal-overlay"
            onMouseDown={onClose}
        >
            <div
                className="modal"
                style={{ maxWidth: width }}
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="modal-header">
                    <div>
                        <h2>{title}</h2>

                        {description && (
                            <p>{description}</p>
                        )}
                    </div>

                    <button
                        className="modal-close"
                        onClick={onClose}
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}