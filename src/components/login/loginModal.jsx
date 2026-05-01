import React, { useEffect, useState } from "react";
import styles from "./loginModal.module.css";

const LoginModal = ({ isOpen, onClose, openRegister, openForgot }) => {
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

  // Validation only (frontend)
  const validateForm = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) return "Invalid email";
    if (!password) return "Password is required";

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password))
      return "Password must contain uppercase, lowercase, number (min 6 chars)";

    return null;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) return showError(validationError);

    // Fake login success (no backend)
    setSuccess("Login successful!");
    setError("");

    // simulate delay
    setTimeout(() => {
      setSuccess("");
      onClose();
    }, 1500);
  };

  const showError = (msg) => {
    setError(msg);
    setSuccess("");
    setTimeout(() => setError(""), 3000);
  };

  const handleGoogle = () => {
    // frontend only simulation
    setSuccess("Google login clicked");
    setError("");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div className={styles.loginModal} onClick={onClose}>
      <div
        className={`${styles.modal} ${isOpen ? styles.active : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalContent}>
          {/* Header */}
          <div className={styles.headerLogin}>
            <h2 className={styles.title}>Welcome Back</h2>
            <p className={styles.subtitle}>Sign In with your account</p>
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleLogin}>
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
              Login
            </button>
          </form>

          {/* Links */}
          <p className={styles.switchText}>
            Don't have an account?{" "}
            <span
              className={styles.switchLink}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
                openRegister();
              }}
            >
              Sign Up
            </span>
            <span
              className={styles.forgotLink}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
                openForgot();
              }}
            >
              Forgot Password?
            </span>
          </p>

          {/* Google Button */}
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

export default LoginModal;