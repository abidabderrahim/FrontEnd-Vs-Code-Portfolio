import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiRightArrowAlt } from "react-icons/bi";
import {
  BiCodeAlt,
  BiServer,
  BiLayer,
  BiPalette,
  BiCheck,
} from "react-icons/bi";
import Layout from "../../components/layout/layout";
import styles from "./home.module.css";

export default function Home() {
  const [homeData, setHomeData] = useState(null);
  const [latestProjects, setLatestProjects] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeStep, setActiveStep] = useState(null);

  useEffect(() => {
    fetch("/config/portfolio_config.json")
      .then((res) => res.json())
      .then((data) => setHomeData(data.portfolio_config))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  useEffect(() => {
    fetch("/config/portfolio_config.json")
      .then((res) => res.json())
      .then((data) => {
        const projects = data.portfolio_config?.projects?.project || [];

        const latestTwo = [...projects].sort((a, b) => b.id - a.id).slice(0, 4);

        setLatestProjects(latestTwo);
      })
      .catch((err) => console.error("Error loading projects:", err));
  }, []);

  const showMore = () => {
    const total = homeData?.home?.testimonials?.length || 0;
    setVisibleCount((prev) => Math.min(prev + 2, total));
  };

  useEffect(() => {
    fetch("/config/portfolio_config.json")
      .then((res) => res.json())
      .then((data) => {
        const posts = data.portfolio_config?.blog?.posts || [];

        const latestFour = [...posts].sort((a, b) => b.id - a.id).slice(0, 4);

        setLatestPosts(latestFour);
      })
      .catch((err) => console.error("Error loading blog posts:", err));
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.mainTitle}>&lt;!-- my world! --&gt;</div>
        <h1 className={styles.title}>
          {homeData?.home?.title || "Loading..."}
        </h1>
        <p className={styles.subTitle}>
          {homeData?.home?.subtitle || "Loading..."}
        </p>
      </section>

      {/* Work Section */}
      <section id="my-work" data-section className={styles.work}>
        <div className={styles.mainTitle}>
          &lt;!-- latest projects --&gt;
        </div>

        <div className={styles.projectsGrid}>
          {latestProjects.map((project) => (
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
                  <div
                    
                    className={styles.linkTitle}
                  >
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

        {/* View all projects */}
        <div className={styles.viewAll}>
          <Link to="/projects" className={styles.viewBtn}>
            <span className={styles.btnText}>view all work</span>
            <span className={styles.btnIcon}>
              <BiRightArrowAlt />
            </span>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section id="my-services" data-section className={styles.services}>
        <div className={styles.mainTitle}>&lt;!-- my services --&gt;</div>

        <div className={styles.servicesGrid}>
          {/* Frontend */}
          <div className={styles.serviceCard}>
            <div className={styles.serviceHeader}>
              <BiCodeAlt className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>
                {homeData?.home?.services?.frontend?.title}
              </h3>
            </div>
            <p className={styles.serviceDescription}>
              {homeData?.home?.services?.frontend?.description}
            </p>
          </div>

          {/* Backend */}
          <div className={styles.serviceCard}>
            <div className={styles.serviceHeader}>
              <BiServer className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>
                {homeData?.home?.services?.backend?.title}
              </h3>
            </div>
            <p className={styles.serviceDescription}>
              {homeData?.home?.services?.backend?.description}
            </p>
          </div>

          {/* Full Stack */}
          <div className={styles.serviceCard}>
            <div className={styles.serviceHeader}>
              <BiLayer className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>
                {homeData?.home?.services?.fullstack?.title}
              </h3>
            </div>
            <p className={styles.serviceDescription}>
              {homeData?.home?.services?.fullstack?.description}
            </p>
          </div>

          {/* UI / UX */}
          <div className={styles.serviceCard}>
            <div className={styles.serviceHeader}>
              <BiPalette className={styles.serviceIcon} />
              <h3 className={styles.serviceTitle}>
                {homeData?.home?.services?.uiux?.title}
              </h3>
            </div>
            <p className={styles.serviceDescription}>
              {homeData?.home?.services?.uiux?.description}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" data-section className={styles.pricing}>
        <div className={styles.mainTitle}>&lt;!-- pricing plans --&gt;</div>
        <div className={styles.pricingGrid}>
          {/* Frontend */}
          <div className={styles.pricingCard}>
            <div className={styles.headding}>
              <BiCodeAlt className={styles.pricingIcon} />
              <h3 className={styles.pricingTitle}>
                {homeData?.home?.pricing?.frontend?.title}
              </h3>
            </div>
            <div className={styles.pricingPrice}>
              {homeData?.home?.pricing?.frontend?.price}
            </div>
            <ul className={styles.pricingList}>
              {homeData?.home?.pricing?.frontend?.includes.map(
                (item, index) => (
                  <li key={index}>
                    <BiCheck className={styles.checkIcon} />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Backend */}
          <div className={styles.pricingCard}>
            <div className={styles.headding}>
              <BiServer className={styles.pricingIcon} />
              <h3 className={styles.pricingTitle}>
                {homeData?.home?.pricing?.backend?.title}
              </h3>
            </div>
            <div className={styles.pricingPrice}>
              {homeData?.home?.pricing?.backend?.price}
            </div>
            <ul className={styles.pricingList}>
              {homeData?.home?.pricing?.backend?.includes.map((item, index) => (
                <li key={index}>
                  <BiCheck className={styles.checkIcon} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Full Stack */}
          <div className={styles.pricingCard}>
            <div className={styles.headding}>
              <BiLayer className={styles.pricingIcon} />
              <h3 className={styles.pricingTitle}>
                {homeData?.home?.pricing?.fullstack?.title}
              </h3>
            </div>
            <div className={styles.pricingPrice}>
              {homeData?.home?.pricing?.fullstack?.price}
            </div>
            <ul className={styles.pricingList}>
              {homeData?.home?.pricing?.fullstack?.includes.map(
                (item, index) => (
                  <li key={index}>
                    <BiCheck className={styles.checkIcon} />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* UI / UX */}
          <div className={styles.pricingCard}>
            <div className={styles.headding}>
              <BiPalette className={styles.pricingIcon} />
              <h3 className={styles.pricingTitle}>
                {homeData?.home?.pricing?.uiux?.title}
              </h3>
            </div>
            <div className={styles.pricingPrice}>
              {homeData?.home?.pricing?.uiux?.price}
            </div>
            <ul className={styles.pricingList}>
              {homeData?.home?.pricing?.uiux?.includes.map((item, index) => (
                <li key={index}>
                  <BiCheck className={styles.checkIcon} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonal Section */}
      <section id="testimonials" data-section className={styles.testimonials}>
        <div className={styles.mainTitle}>&lt;!-- testimonials --&gt;</div>
        <div className={styles.testimonialsGrid}>
          {homeData?.home?.testimonials
            ?.slice(0, visibleCount)
            .map((item, idx) => (
              <div
                key={idx}
                className={styles.testimonialCard}
                style={{ alignSelf: idx % 2 === 0 ? "flex-start" : "flex-end" }}
              >
                <img
                  src={item.profile}
                  alt={item.name}
                  className={styles.testimonialAvatar}
                />
                <div className={styles.testimonialContent}>
                  <p className={styles.testimonialMessage}>{item.message}</p>
                  <div className={styles.testimonialDetails}>
                    <span className={styles.clientName}>{item.name}</span>
                    <span className={styles.clientJob}>{item.job}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {homeData?.home?.testimonials &&
          visibleCount < homeData.home.testimonials.length && (
            <div className={styles.showMore}>
              <button onClick={showMore} className={styles.showBtn}>
                Show More ...
              </button>
            </div>
          )}
      </section>

      {/* How I Work Section */}
      <section id="how-i-work" data-section className={styles.howIwork}>
        <div className={styles.mainTitle}>&lt;!-- how i work --&gt;</div>

        <div className={styles.stepsList}>
          {homeData?.home?.how_i_work?.steps?.map((step, index) => (
            <div
              key={index}
              className={`${styles.stepItem} ${
                index === activeStep ? styles.open : ""
              }`}
              onClick={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className={styles.topRow}>
                <span className={styles.stepTitle}>{step.title}</span>
                <span className={styles.stepIndex}>
                  &lt;!-- {String(index + 1).padStart(2, "0")} --&gt;
                </span>
              </div>

              <div className={styles.hiddenContent}>
                <p className={styles.description}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" data-section className={styles.posts}>
        <div className={styles.mainTitle}>
          &lt;!-- latest articles --&gt;
        </div>

        <div className={styles.postsGrid}>
          {latestPosts.map((post) => (
            <Link to={`/blog/${post.slug}`} key={post.id} className={styles.postCard}>
              <div className={styles.postImageWrapper}>
                <img
                  src={post.image}
                  alt={post.title}
                  className={styles.postImage}
                />
              </div>

              <div className={styles.postContent}>
                <div className={styles.postHeader}>
                  <div className={styles.linkTitle}>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <span className={styles.linkIcon}>
                      <BiRightArrowAlt />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all blog posts */}
        <div className={styles.viewAll}>
          <Link to="/blog" className={styles.viewBtn}>
            <span className={styles.btnText}>view all blog</span>
            <span className={styles.btnIcon}>
              <BiRightArrowAlt />
            </span>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
