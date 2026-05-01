import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/layout";
import { BiRightArrowAlt } from "react-icons/bi";
import styles from "./contact.module.css";

export default function Contact() {
  const [contactData, setContactData] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const showError = (msg) => {
    setError(msg);
    setSuccess("");
    setTimeout(() => setError(""), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.firstName.trim()) return "First name is required";
    if (!form.lastName.trim()) return "Last name is required";

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email)) return "Valid email is required";

    if (!form.subject.trim()) return "Subject is required";
    if (!form.message.trim()) return "Message is required";

    if (form.message.length < 10)
      return "Message must be at least 10 characters";

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errorMsg = validateForm();
    if (errorMsg) return showError(errorMsg);

    // frontend fake success
    setSuccess("Message sent successfully!");
    setError("");

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    });

    setTimeout(() => setSuccess(""), 3000);
  };

  useEffect(() => {
    fetch("/config/portfolio_config.json")
      .then((res) => res.json())
      .then((data) => setContactData(data.portfolio_config))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.commentTitle}>
          &lt;!-- contact with me --&gt;
        </div>
        <h1 className={styles.title}>
          {contactData?.contact?.title || "Loading..."}
        </h1>
        <p className={styles.subTitle}>
          {contactData?.contact?.subtitle || "Loading..."}
        </p>
      </section>

      {/* Connect Section */}
      <section id="connect" data-section className={styles.connect}>
        <div className={styles.commentTitle}>
          &lt;!-- connect with me --&gt;
        </div>
        <div className={styles.connectContent}>
          <div className={styles.connectText}>
            <h1 className={styles.title}>
              {contactData?.contact?.connect?.title || "Loading..."}
            </h1>
            <p className={styles.subTitle}>
              {contactData?.contact?.connect?.subtitle || "Loading..."}
            </p>
          </div>
          <form className={styles.connectForm} onSubmit={handleSubmit}>
            <div className={styles.nameRow}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className={styles.inputField}
                value={form.firstName}
                onChange={handleChange}
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className={styles.inputField}
                value={form.lastName}
                onChange={handleChange}
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              className={styles.inputField}
              value={form.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="subject"
              placeholder="Your Purpose"
              className={styles.inputField}
              value={form.subject}
              onChange={handleChange}
            />

            <textarea
              name="message"
              placeholder="Write Your Message"
              className={styles.textareaField}
              rows="6"
              value={form.message}
              onChange={handleChange}
            />

            <button type="submit" className={styles.connectBtn}>
              <span className={styles.btnText}>Send Message</span>
              <span className={styles.btnIcon}>
                <BiRightArrowAlt />
              </span>
            </button>

            {/* Messages */}
            {error && <div className={styles.messageError}>{error}</div>}
            {success && (
              <div style={{ color: "green", textAlign: "center" }}>
                {success}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Media Section */}
      <section id="media" data-section className={styles.media}>
        <div className={styles.commentTitle}>
          &lt;!-- social & contact links --&gt;
        </div>
        <div className={styles.mediaGrid}>
          <div className={styles.socialMedia}>
            <div className={styles.socialLabel}>socila media</div>
            <ul className={styles.socialList}>
              {Object.entries(
                contactData?.contact?.media?.socialmedia || {}
              ).map(([name, url]) => (
                <li key={name} className={styles.socialItem}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.contactMedia}>
            <div className={styles.contactLabel}>personal contact</div>
            <ul className={styles.contactList}>
              {Object.entries(
                contactData?.contact?.media?.personalcontact || {}
              ).map(([name, value]) => (
                <li key={name} className={styles.contactItem}>
                  {name === "email" ? (
                    <a href={`mailto:${value}`}>{value}</a>
                  ) : name === "phone" ? (
                    <a href={`tel:${value}`}>{value}</a>
                  ) : (
                    value
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
}
