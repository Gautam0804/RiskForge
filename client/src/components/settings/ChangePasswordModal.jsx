import { useState } from "react";
import {
    Eye,
    EyeOff,
    Lock,
    X,
    CheckCircle2,
    AlertTriangle
} from "lucide-react";

import api from "../../services/api";

import "./ChangePasswordModal.css";

export default function ChangePasswordModal({ onClose }) {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleChange(event) {
        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    }

    function togglePassword(field) {
        setShowPasswords((previous) => ({
            ...previous,
            [field]: !previous[field]
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        // -----------------------------
        // Validation
        // -----------------------------

        if (
            !form.currentPassword ||
            !form.newPassword ||
            !form.confirmPassword
        ) {
            setError(
                "Please complete all password fields."
            );

            return;
        }

        if (form.newPassword.length < 8) {
            setError(
                "New password must be at least 8 characters long."
            );

            return;
        }

        if (
            form.newPassword !==
            form.confirmPassword
        ) {
            setError(
                "New password and confirmation do not match."
            );

            return;
        }

        if (
            form.currentPassword ===
            form.newPassword
        ) {
            setError(
                "New password must be different from your current password."
            );

            return;
        }

        // -----------------------------
        // API request
        // -----------------------------

        try {
            setLoading(true);

            await api.patch(
                "/auth/change-password",
                {
                    currentPassword:
                        form.currentPassword,

                    newPassword:
                        form.newPassword
                }
            );

            // -----------------------------
            // Password changed successfully
            // -----------------------------

            setSuccess(
                "Password changed successfully. Please log in again."
            );

            // The old JWT has now been invalidated
            // by the backend token_version mechanism.
            localStorage.removeItem(
                "riskforge_token"
            );

            // Redirect to login after showing
            // the success message briefly.
            setTimeout(() => {
                window.location.href = "/login";
            }, 1200);

        } catch (error) {
            console.error(
                "Password change failed:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Unable to change password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="password-modal-overlay"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    if (!loading) {
                        onClose();
                    }
                }
            }}
        >
            <div className="password-modal">

                {/* -------------------------------- */}
                {/* Header */}
                {/* -------------------------------- */}

                <div className="password-modal-header">

                    <div className="password-modal-title">

                        <div className="password-modal-icon">
                            <Lock size={19} />
                        </div>

                        <div>
                            <h2>
                                Change Password
                            </h2>

                            <p>
                                Update your RiskForge
                                account password.
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="password-modal-close"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* -------------------------------- */}
                {/* Error Message */}
                {/* -------------------------------- */}

                {error && (
                    <div className="password-message error">

                        <AlertTriangle size={16} />

                        <span>
                            {error}
                        </span>

                    </div>
                )}

                {/* -------------------------------- */}
                {/* Success Message */}
                {/* -------------------------------- */}

                {success && (
                    <div className="password-message success">

                        <CheckCircle2 size={16} />

                        <span>
                            {success}
                        </span>

                    </div>
                )}

                {/* -------------------------------- */}
                {/* Form */}
                {/* -------------------------------- */}

                <form
                    className="password-form"
                    onSubmit={handleSubmit}
                >

                    {/* Current Password */}

                    <PasswordField
                        label="Current password"
                        name="currentPassword"
                        value={
                            form.currentPassword
                        }
                        onChange={
                            handleChange
                        }
                        visible={
                            showPasswords.current
                        }
                        onToggle={() =>
                            togglePassword(
                                "current"
                            )
                        }
                        disabled={loading}
                    />

                    {/* New Password */}

                    <PasswordField
                        label="New password"
                        name="newPassword"
                        value={
                            form.newPassword
                        }
                        onChange={
                            handleChange
                        }
                        visible={
                            showPasswords.new
                        }
                        onToggle={() =>
                            togglePassword(
                                "new"
                            )
                        }
                        disabled={loading}
                    />

                    {/* Confirm Password */}

                    <PasswordField
                        label="Confirm new password"
                        name="confirmPassword"
                        value={
                            form.confirmPassword
                        }
                        onChange={
                            handleChange
                        }
                        visible={
                            showPasswords.confirm
                        }
                        onToggle={() =>
                            togglePassword(
                                "confirm"
                            )
                        }
                        disabled={loading}
                    />

                    {/* -------------------------------- */}
                    {/* Password Requirements */}
                    {/* -------------------------------- */}

                    <div className="password-requirements">

                        <span>
                            Password requirements
                        </span>

                        <ul>

                            <li
                                className={
                                    form.newPassword.length >=
                                    8
                                        ? "valid"
                                        : ""
                                }
                            >
                                At least 8 characters
                            </li>

                            <li
                                className={
                                    form.newPassword &&
                                    form.newPassword ===
                                        form.confirmPassword
                                        ? "valid"
                                        : ""
                                }
                            >
                                Passwords must match
                            </li>

                        </ul>

                    </div>

                    {/* -------------------------------- */}
                    {/* Actions */}
                    {/* -------------------------------- */}

                    <div className="password-modal-actions">

                        <button
                            type="button"
                            className="password-cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="password-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Changing..."
                                : "Change Password"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}


/* ================================================= */
/* Password Field Component */
/* ================================================= */

function PasswordField({
    label,
    name,
    value,
    onChange,
    visible,
    onToggle,
    disabled
}) {
    return (
        <label className="password-field">

            <span>
                {label}
            </span>

            <div className="password-input-wrapper">

                <input
                    type={
                        visible
                            ? "text"
                            : "password"
                    }
                    name={name}
                    value={value}
                    onChange={onChange}
                    autoComplete={
                        name ===
                        "currentPassword"
                            ? "current-password"
                            : "new-password"
                    }
                    disabled={disabled}
                    required
                />

                <button
                    type="button"
                    className="password-visibility"
                    onClick={onToggle}
                    disabled={disabled}
                    aria-label={
                        visible
                            ? "Hide password"
                            : "Show password"
                    }
                >
                    {visible ? (
                        <EyeOff size={17} />
                    ) : (
                        <Eye size={17} />
                    )}
                </button>

            </div>

        </label>
    );
}