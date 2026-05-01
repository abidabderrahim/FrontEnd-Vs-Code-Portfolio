import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { BiRightArrowAlt } from "react-icons/bi";
import Layout from "../../components/layout/layout";
import styles from "./projects.module.css";

export default function Projects() {
  const [projectsData, setProjectsData] = useState(null);

  useEffect(() => {
    fetch("/config/portfolio_config.json")
      .then((res) => res.json())
      .then((data) => setProjectsData(data.portfolio_config))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.commentTitle}>&lt;!-- my work --&gt;</div>
        <h1 className={styles.title}>
          {projectsData?.projects?.title || "Loading..."}
        </h1>
        <p className={styles.subTitle}>
          {projectsData?.projects?.subtitle || "Loading..."}
        </p>
      </section>

      {/* Projects Section */}
      <section id="projects" data-section className={styles.projects}>
        <div className={styles.commentTitle}>&lt;!-- my projects --&gt;</div>
        {/* Cards */}
        <div className={styles.projectsGrid}>
          {projectsData?.projects?.project?.map((project) => (
            <Link to={`/projects/${project.slug}`} key={project.id} className={styles.projectCard}>
              <div className={styles.projectImageWrapper}>
                <img
                  src={project.image}
                  alt={project.title}
                  className={styles.projectImage}
                />
              </div>
              <div className={styles.projectContent}>
                <div className={styles.projectHeader}>
                  <div className={styles.linkTitle}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <span className={styles.linkIcon}>
                      <BiRightArrowAlt />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
