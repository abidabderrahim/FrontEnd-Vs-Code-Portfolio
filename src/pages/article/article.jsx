import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { BiRightArrowAlt } from "react-icons/bi";
import { BsChatSquareHeartFill, BsShareFill } from "react-icons/bs";
import styles from "./article.module.css";

export default function Article() {
  const { slug } = useParams();
  const [postsData, setPostsData] = useState(null);
  const [post, setPost] = useState(null);
  const [blogtData, setBlogData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const cached = sessionStorage.getItem("portfolio_config");

        if (cached) {
          const portfolioConfig = JSON.parse(cached);
          initData(portfolioConfig);
          return;
        }

        const res = await fetch("/config/portfolio_config.json");
        const data = await res.json();

        sessionStorage.setItem(
          "portfolio_config",
          JSON.stringify(data.portfolio_config)
        );

        initData(data.portfolio_config);
      } catch (err) {
        console.error("Error loading JSON:", err);
      }
    };

    const initData = (portfolioConfig) => {
      setPostsData(portfolioConfig);
      setBlogData(portfolioConfig);
      setComments(portfolioConfig.comments || []);

      const currentPost = portfolioConfig.blog.posts.find(
        (item) => item.slug === slug
      );

      setPost(currentPost);
    };

    loadData();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert("Article link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  const filteredComments = comments
    .filter((c) => c.postId === post.id && c.status === "approved")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      return showError("All fields are required");
    }

    // Optional: email validation
    const emailValid = /\S+@\S+\.\S+/.test(email);
    if (!emailValid) {
      return showError("Enter a valid email");
    }

    const newComment = {
      id: Date.now(),
      postId: post.id,
      author: name,
      email,
      message,
      date: new Date().toISOString().split("T")[0],
      status: "approved",
      replies: [],
    };

    // Update UI instantly
    setComments((prev) => [newComment, ...prev]);

    // Reset form
    setName("");
    setEmail("");
    setMessage("");
  };

  if (!post) {
    return (
      <Layout>
        <section className={styles.section}>
          <h2>Loading article...</h2>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.commentTitle}>&lt;!-- blog article --&gt;</div>
        <h1 className={styles.title}>
          {blogtData?.blog?.articleTitle || "Loading..."}
        </h1>
        <p className={styles.subTitle}>
          {blogtData?.blog?.articlesubTitle || "Loading..."}
        </p>
      </section>

      {/* Article Section */}
      <section id="article" data-section className={styles.article}>
        <div className={styles.commentTitle}>&lt;!-- my article --&gt;</div>
        {/* Article Image */}
        <img src={post.image} alt={post.title} className={styles.image} />

        {/* Title */}
        <h1 className={styles.title}>{post.title}</h1>

        {/* Category + Date */}
        <div className={styles.categoryDate}>
          <span className={styles.category}>{post.category}</span>
          <span className={styles.sep}></span>
          <span className={styles.date}>{post.date}</span>
        </div>

        {/* Description */}
        <p className={styles.description}>{post.description}</p>

        {/* Article Sections */}
        {post.sections.map((section, index) => (
          <div key={index} className={styles.sectionPart}>
            <h2 className={styles.sectionHeading}>{section.heading}</h2>
            <p className={styles.sectionContent}>{section.content}</p>
          </div>
        ))}

        {/* Likes Button + Share Link */}
        <div className={styles.meta}>
          <button className={styles.likeButton}>{post.likes} <BsChatSquareHeartFill className={styles.Icon} /></button>
          <button className={styles.shareButton} onClick={handleShare}>Share <BsShareFill className={styles.Icon} /></button>
        </div>
      </section>

      {/* Comment Section */}
      <section id="comment" data-section className={styles.comment}>
        {/* Comments */}
        {filteredComments.length === 0 ? (
          <p className={styles.messageError}>No comments yet.</p>
        ) : (
          filteredComments.map((comment) => (
            <div key={comment.id} className={styles.commentBox}>

              <div className={styles.commentUser}>
                <div className={styles.commentHeader}>
                  <strong>{comment.author}</strong>
                  <span>{comment.date}</span>
                </div>

                <p className={styles.commentMessage}>{comment.message}</p>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className={styles.replies}>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className={styles.replyBox}>
                      <strong>
                        {reply.author} {reply.role === "admin" && "(Admin)"}
                      </strong>
                      <p>{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        {/* Comments */}
        {/* Add Comment */}
        <div className={styles.addComment}>
          <h3 className={styles.testTitle}>Add Comment</h3>
          <form className={styles.form} onSubmit={handleCommentSubmit}>

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.commentIn}
            />

            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.commentIn}
            />

            <textarea
              placeholder="Write your comment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.commentTexta}
            />

            <button type="submit" className={styles.commentBtn}>
              <span className={styles.btnText}>My Comment</span>
              <span className={styles.btnIcon}>
                <BiRightArrowAlt />
              </span>
            </button>

            {error && <p className={styles.messageError}>{error}</p>}

          </form>
        </div>
        {/* Add Comment */}
      </section>
    </Layout>
  );
}
