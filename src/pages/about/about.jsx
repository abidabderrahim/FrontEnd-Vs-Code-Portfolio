import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/layout";
import styles from "./about.module.css";

export default function About() {
  const [aboutData, setAboutData] = useState(null);
  const [activeEducation, setActiveEducation] = useState(null);

  useEffect(() => {
    fetch("/config/portfolio_config.json")
      .then((res) => res.json())
      .then((data) => setAboutData(data.portfolio_config))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.commentTitle}>&lt;!-- about me --&gt;</div>
        <h1 className={styles.title}>
          {aboutData?.about?.title || "Loading..."}
        </h1>
        <p className={styles.subTitle}>
          {aboutData?.about?.subtitle || "Loading..."}
        </p>
      </section>

      {/* Profile Section */}
      <section id="profile" data-section className={styles.profile}>
        <div className={styles.commentTitle}>&lt;!-- my profile --&gt;</div>
        <div className={styles.profileBox}>
          <img
            src={aboutData?.about?.profile?.image || "/Images/default.webp"}
            alt="Profile Picture"
            className={styles.imageProfile}
          />
          <div className={styles.socialMedia}>
            <span className={styles.followLabel}>Follow me:</span>

            <div className={styles.socialLinks}>
              <a
                href={aboutData?.about?.profile?.links?.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                .In
              </a>
              <a
                href={aboutData?.about?.profile?.links?.linkedin || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                .Li
              </a>
              <a
                href={aboutData?.about?.profile?.links?.twitter || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                .X
              </a>
              <a
                href={aboutData?.about?.profile?.links?.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                .Gi
              </a>
            </div>
          </div>
        </div>
        <div className={styles.aboutBox}>
          <p className={styles.text}>
            {aboutData?.about?.profile?.aboutMe || "Loading..."}
          </p>
          <p className={styles.text}>
            {aboutData?.about?.profile?.myWork || "Loading..."}
          </p>
          <p className={styles.text}>
            {aboutData?.about?.profile?.whatIdo || "Loading..."}
          </p>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" data-section className={styles.experience}>
        <div className={styles.commentTitle}>&lt;!-- my experience --&gt;</div>
        {aboutData?.about?.experience?.items?.map((item, index) => (
          <div key={index} className={styles.experienceItem}>
            <h3 className={styles.role}>{item.role}</h3>
            <div className={styles.metaRow}>
              <span className={styles.company}>{item.company}</span>
              <span className={styles.sep}></span>
              <span className={styles.period}>{item.period}</span>
            </div>
            <p className={styles.description}>{item.description}</p>
          </div>
        ))}
      </section>
      
      {/* Education Section */}
      <section id="education" data-section className={styles.education}>
        <div className={styles.commentTitle}>&lt;!-- education --&gt;</div>
        <div className={styles.educationList}>
          {aboutData?.about?.education?.items?.map((item, index) => (
            <div
              key={index}
              className={`${styles.educationItem} ${
                index === activeEducation ? styles.open : ""
              }`}
              onClick={() => setActiveEducation(index)}
              onMouseLeave={() => setActiveEducation(null)}
            >
              <div className={styles.topRow}>
                <span className={styles.degree}>{item.degree}</span>
                <span className={styles.period}>{item.period}</span>
              </div>

              <div className={styles.hiddenContent}>
                <div className={styles.institution}>{item.institution}</div>
                <p className={styles.description}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" data-section className={styles.skills}>
        <div className={styles.commentTitle}>&lt;!-- skills --&gt;</div>
        <div className={styles.skillsGrid}>
          {aboutData?.about?.skills?.categories?.map((category, index) => (
            <div key={index} className={styles.skillCard}>
              <div className={styles.skillLabel}>{category.label}</div>

              <ul className={styles.skillList}>
                {category.items.map((skill, i) => (
                  <li key={i} className={styles.skillItem}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Stack Section */}
      <section id="stack" data-section className={styles.stack}>
        <div className={styles.commentTitle}>&lt;!-- tech stack --&gt;</div>
        <div className={styles.stackGrid}>
          {aboutData?.about?.stack?.items?.map((item, index) => (
            <div key={index} className={styles.stackItem}>
              <div className={styles.stackName}>{item.name}</div>

              <div className={styles.stackIconWrapper}>
                {item.icon ? (
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={styles.stackIcon}
                  />
                ) : (
                  <div className={styles.noIcon}>No Icon</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
