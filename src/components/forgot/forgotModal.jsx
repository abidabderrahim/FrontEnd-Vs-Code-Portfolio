import React, { useEffect, useState } from "react";
import styles from "./forgotModal.module.css";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  // Validation
  const validateForm = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) return "Enter a valid email";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) return showError(validationError);

    // Fake success (frontend only)
    setSent(true);
    setSuccess("Reset link sent successfully!");
    setError("");

    setTimeout(() => {
      setSuccess("");
      onClose();
      setEmail("");
      setSent(false);
    }, 2000);
  };

  const showError = (msg) => {
    setError(msg);
    setSuccess("");
    setTimeout(() => setError(""), 3000);
  };

  return (
    <div className={styles.ForgotPasswordModal} onClick={onClose}>
      <div
        className={`${styles.modal} ${isOpen ? styles.active : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalContent}>

          {/* Title */}
          <h2 className={styles.title}>Forgot Password</h2>

          {/* Form */}
          {!sent ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />

              <button type="submit" className={styles.submitBtn}>
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className={styles.successMessage}>
              Reset link sent! Please check your email.
            </div>
          )}

          {/* Messages */}
          {error && <div className={styles.messageError}>{error}</div>}
          {success && (
            <div style={{ color: "green", textAlign: "center" }}>
              {success}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;