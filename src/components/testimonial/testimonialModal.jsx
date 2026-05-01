import React, { useState, useEffect } from "react";
import styles from "./testimonial.module.css";
import { BiRightArrowAlt } from "react-icons/bi";
export default function TestimonialModal({
  isOpen,
  onClose,
  projectId,
  setTestimonials,
}) {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // Close with ESC
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Check if already submitted (localStorage)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("testimonials")) || [];

    const already = saved.some(
      (t) => t.projectId === projectId && t.email === localStorage.getItem("email")
    );

    setAlreadySubmitted(already);
  }, [projectId]);

  if (!isOpen) return null;

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  // Handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return showError("Only images allowed");
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // base64
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !job || !message || !image) {
      return showError("All fields are required");
    }

    const email = localStorage.getItem("email") || `${Date.now()}@guest.com`;

    const newTestimonial = {
      id: Date.now(),
      name,
      job,
      message,
      image,
      email,
      date: new Date().toISOString().split("T")[0],
      projectId,
    };

    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem("testimonials")) || [];
    const updated = [...saved, newTestimonial];
    localStorage.setItem("testimonials", JSON.stringify(updated));

    // Update UI
    setTestimonials((prev) => [...prev, newTestimonial]);

    // Save email (simulate user)
    localStorage.setItem("email", email);

    // Reset
    setName("");
    setJob("");
    setMessage("");
    setImage("");
    setPreview("");
    setAlreadySubmitted(true);

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.testTitle}>Add Testimonial</h2>
          <button className={styles.testCloseBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Image Upload */}
          <label className={styles.uploadBox}>
            {preview ? (
              <img src={preview} alt="preview" />
            ) : (
              <span>Upload Image</span>
            )}
            <input type="file" onChange={handleImageChange} hidden />
          </label>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.testimonialIn}
          />

          <input
            type="text"
            placeholder="Your Job"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className={styles.testimonialIn}
          />

          <textarea
            placeholder="Your Feedback"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={200}
            className={styles.testimonialTexta}
          />

          <button type="submit" disabled={alreadySubmitted}
            className={styles.testimonialBtn}>
            <span className={styles.btnText}>{alreadySubmitted ? "Already Submitted" : "Submit"}</span>
            <span className={styles.btnIcon}>
              <BiRightArrowAlt />
            </span>
          </button>

          {error && <p className={styles.messageError}>{error}</p>}
        </form>
      </div>
    </div>
  );
}