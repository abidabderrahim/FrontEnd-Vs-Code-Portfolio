import React, { useEffect, useState } from "react";
import styles from "./registerModal.module.css";

const RegisterModal = ({ isOpen, onClose, openLogin }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  // Validation only
  const validateForm = () => {
    if (fullName.trim().length < 3) return "Name must be at least 3 characters";

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) return "Invalid email format";

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password))
      return "Password must contain uppercase, number, symbol (min 8 chars)";

    return null;
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) return showError(validationError);

    // Fake success (frontend only)
    setSuccess("Account created successfully!");
    setError("");

    setTimeout(() => {
      setSuccess("");
      onClose();
      openLogin(); // optional: switch to login
    }, 1500);
  };

  const showError = (msg) => {
    setError(msg);
    setSuccess("");
    setTimeout(() => setError(""), 3000);
  };

  const handleGoogle = () => {
    setSuccess("Google register clicked");
    setError("");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div className={styles.RegisterModal} onClick={onClose}>
      <div
        className={`${styles.modal} ${isOpen ? styles.active : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalContent}>
          
          {/* Header */}
          <div className={styles.headerRegister}>
            <h2 className={styles.title}>Create Account</h2>
            <p className={styles.subtitle}>Sign up with your details</p>
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
            />

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />

            <button type="submit" className={styles.submitBtn}>
              Register
            </button>
          </form>

          {/* Switch */}
          <p className={styles.switchText}>
            Already have an account?{" "}
            <span
              className={styles.switchLink}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
                openLogin();
              }}
            >
              Sign In
            </span>
          </p>

          {/* Google */}
          <button className={styles.googleBtn} onClick={handleGoogle}>
            <img src="/images/google-logo.svg" alt="Google Logo" />
            Continue with Google
          </button>

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

export default RegisterModal;