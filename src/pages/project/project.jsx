import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/layout/layout";
import TestimonialModal from "../../components/testimonial/testimonialModal";
import { BsChatSquareHeartFill, BsShareFill } from "react-icons/bs";
import styles from "./project.module.css";

export default function Project() {
  const { slug } = useParams();

  const [projectsData, setProjectsData] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/config/portfolio_config.json")
      .then((res) => res.json())
      .then((data) => setProjectsData(data.portfolio_config))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  useEffect(() => {
    fetch("/config/portfolio_config.json")
      .then((res) => res.json())
      .then((data) => {
        const portfolioConfig = data.portfolio_config;

        setProjectsData(portfolioConfig);

        const currentProject = portfolioConfig.projects.project.find(
          (item) => item.slug === slug
        );

        if (!currentProject) {
          setLoading(false);
          return;
        }

        setProject(currentProject);

        const filteredTestimonials =
          portfolioConfig.home.testimonials.filter(
            (t) => t.projectId === currentProject.id
          );

        setTestimonials(filteredTestimonials);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading JSON:", err);
        setLoading(false);
      });
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("Project link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  if (loading) {
    return (
      <Layout>
        <section className={styles.section}>
          <h2>Loading project...</h2>
        </section>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <section className={styles.section}>
          <h2>Project not found</h2>
          <Link to="/projects">← Back to projects</Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.commentTitle}>&lt;!-- project --&gt;</div>
        <h1 className={styles.title}>
          {projectsData?.projects?.projectTitle || "Loading..."}
        </h1>
        <p className={styles.subTitle}>
          {projectsData?.projects?.projectsubTitle || "Loading..."}
        </p>
      </section>

      {/* Project Section */}
      <section id="project" data-section className={styles.project}>
        <div className={styles.commentTitle}>&lt;!-- my project --&gt;</div>
        {/* Project Image */}
        <img src={project.image} alt={project.title} className={styles.image} />

        {/* Project Title */}
        <h1 className={styles.title}>{project.title}</h1>

        {/* Category + Date */}
        <div className={styles.categoryDate}>
          <span className={styles.category}>{project.category}</span>
          <span className={styles.sep}></span>
          <span className={styles.date}>{project.date}</span>
        </div>

        {/* Project Description */}
        <p className={styles.description}>{project.description}</p>

        {/* Project Stack */}
        {project.stack && project.stack.length > 0 && (
          <div className={styles.stackSection}>
            <h3 className={styles.Heading}>Tech Stack</h3>
            <ul className={styles.stack}>
              {project.stack.map((tech, index) => (
                <li className={styles.tech} key={index}>{tech}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Project Links */}
        {project.links && (
          <div className={styles.links}>
            <h3 className={styles.Heading}>Project Links</h3>
            {project.links.demo && (
              <a href={project.links.demo} target="_blank" rel="noreferrer">
                Live Demo
              </a>
            )}
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
            {project.links.figma && (
              <a href={project.links.figma} target="_blank" rel="noreferrer">
                Figma
              </a>
            )}
          </div>
        )}

        {/* Like & Share Buttons */}
        <div className={styles.meta}>
          <button className={styles.likeButton}>{project.likes} <BsChatSquareHeartFill className={styles.Icon} /></button>
          <button className={styles.shareButton} onClick={handleShare}>
            Share <BsShareFill className={styles.Icon} />
          </button>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonial" data-section className={styles.testimonial}>
        <div className={styles.commentTitle}>&lt;!-- add testimonail --&gt;</div>

        {testimonials.length === 0 ? (
          <p className={styles.noTestimonials}>
            No testimonials available for this project.
          </p>
        ) : (
          <div className={styles.testimonialflex}>
            {testimonials.map((item) => (
              <div key={item.id} className={styles.testimonialCard}>

                {/* Top Info */}
                <div className={styles.testimonialHeader}>
                  <img
                    src={item.profile}
                    alt={item.name}
                    className={styles.avatar}
                  />
                  <div>
                    <h4 className={styles.name}>{item.name}</h4>
                    <span className={styles.job}>{item.job}</span>
                  </div>
                </div>

                {/* Message */}
                <p className={styles.message}>
                  “{item.message}”
                </p>

                {/* Footer */}
                <div className={styles.testimonialFooter}>
                  <span className={styles.date}>{item.date}</span>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Testimonial Section */}
      <section id="add-testimonial" data-section className={styles.addTestimonial}>
        <button className={styles.openAddTestimonial} onClick={() => setIsModalOpen(true)}>
          Add Testimonial
        </button>

        <TestimonialModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectId={project.id}
          setTestimonials={setTestimonials}
        />
      </section>
      {/* Add Testimonial Section */}
    </Layout>
  );
}
