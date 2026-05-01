import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/layout";
import {
  BiRightArrowAlt,
  BiFilter,
  BiLoaderCircle,
  BiNotification,
} from "react-icons/bi";
import styles from "./blog.module.css";

export default function Blog() {
  const [blogtData, setBlogData] = useState(null);
  const POSTS_PER_LOAD = 2;
  const INITIAL_POSTS = 6;
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_POSTS);

  useEffect(() => {
    fetch("/config/portfolio_config.json")
      .then((res) => res.json())
      .then((data) => setBlogData(data.portfolio_config))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  const posts = blogtData?.blog?.posts || [];

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return posts;

    return posts.filter((post) => post.title?.toLowerCase().includes(q));
  }, [posts, search]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_LOAD);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.commentTitle}>&lt;!-- blog --&gt;</div>
        <h1 className={styles.title}>
          {blogtData?.blog?.title || "Loading..."}
        </h1>
        <p className={styles.subTitle}>
          {blogtData?.blog?.subtitle || "Loading..."}
        </p>
      </section>

      {/* Blog Section */}
      <section id="blog" data-section className={styles.blog}>
        <div className={styles.commentTitle}>&lt;!-- blog articles --&gt;</div>

        {/* Search */}
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>
            <BiFilter />
          </span>
          <input
            type="text"
            placeholder="What Are You Looking For"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Cards */}
        <div className={styles.blogGrid}>
          {visiblePosts.map((post) => (
            <Link to={`/blog/${post.slug}`} key={post.id} className={styles.blogCard}>
              <div className={styles.blogImageWrapper}>
                <img
                  src={post.image}
                  alt={post.title}
                  className={styles.blogImage}
                />
              </div>

              <div className={styles.blogContent}>
                <div className={styles.blogHeader}>
                  <div className={styles.linkTitle}>
                    <h3 className={styles.blogTitle}>{post.title}</h3>
                    <span className={styles.linkIcon}>
                      <BiRightArrowAlt />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {visibleCount < filteredPosts.length && (
          <div className={styles.showMoreWrapper}>
            <button className={styles.showMoreBtn} onClick={handleShowMore}>
              <span className={styles.btnText}>Show more</span>
              <span className={styles.btnIcon}>
                <BiLoaderCircle />
              </span>
            </button>
          </div>
        )}
      </section>

      {/* Subscribe Section */}
      <section id="subscribe" data-section className={styles.subscribe}>
        <div className={styles.commentTitle}>&lt;!-- subscribe --&gt;</div>
        <div className={styles.subscribeBox}>
          <h2 className={styles.subscribeTitle}>
            {blogtData?.blog?.subscribeTitle || "Loading..."}
          </h2>

          <form className={styles.subscribeForm}>
            <input
              type="email"
              placeholder="Enter your email address"
              className={styles.subscribeInput}
              required
            />
            <button type="submit" className={styles.subscribeBtn}>
              <span className={styles.btnText}>Subscribe</span>
              <span className={styles.btnIcon}>
                <BiNotification />
              </span>
            </button>
          </form>

          <p className={styles.subscribeSubTitle}>
            {blogtData?.blog?.subscribesubTitle || "Loading..."}
          </p>
        </div>
      </section>
    </Layout>
  );
}
