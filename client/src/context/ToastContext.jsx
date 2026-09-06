import { createContext, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = "info") => {
        const id = Date.now();

        setToasts((current) => [
            ...current,
            {
                id,
                message,
                type
            }
        ]);

        setTimeout(() => {
            setToasts((current) =>
                current.filter((toast) => toast.id !== id)
            );
        }, 3500);
    };

    const removeToast = (id) => {
        setToasts((current) =>
            current.filter((toast) => toast.id !== id)
        );
    };

    return (
        <ToastContext.Provider
            value={{
                showToast,
                removeToast
            }}
        >
            {children}

            <div className="toast-container">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider"
        );
    }

    return context;
}

import Toast from "../components/common/Toast";